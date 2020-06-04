from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider
import json
import requests
from datetime import  datetime
import time

#Connect to Astra Cluster
#Redo this after git project restructuring
with open('astra.credentials/UserCred.json') as f:
    cred = json.load(f)
cloud_config= {
        'secure_connect_bundle': 'astra.credentials/secure-connect-'+cred['cluster']+'.zip'
}
auth_provider = PlainTextAuthProvider(cred['username'], cred['password'])
cluster = Cluster(cloud=cloud_config, auth_provider=auth_provider)
session = cluster.connect()

row = session.execute("select release_version from system.local").one()
if row:
    print(row[0])
else:
    print("An error occurred.")

#Create Table leaves if it does not exist
session.set_keyspace(cred['keyspace'])
f = open('astra.import/Leaves.Astra.cql')
exec_command = str(f.read())
exec_command = exec_command.replace('keyspace_name',cred['keyspace'],1)
exec_command = exec_command.replace('table_name',cred['table'],1)
session.execute(exec_command)
rows = 0


#Request data from solr
params = (
    ('fl', '*'),
    ('q', '*'),
    ('rows', str(rows)),
)

response = requests.get('https://ss346483-us-east-1-aws.searchstax.com/solr/leaves_anant_stage/select', params=params)
response_json = response.json()
num_docs = response_json['response']['numFound']
docs = response_json['response']['docs']
real_docs = len(docs)


print(str(real_docs)+'/'+str(num_docs))


for i in range(len(docs)):
    tmp_doc = docs[i]
    #Missing Fields Checks
    try:
        title_check = tmp_doc['title']
    except KeyError:
        continue

    try:
        lang_check = tmp_doc['language']
    except KeyError:
        tmp_doc['language'] = 'en'

    try:
        picture_check = tmp_doc['preview_picture']
    except KeyError:
        tmp_doc['preview_picture'] = 'https://dummyimage.com/170/000/ffffff&text='+(tmp_doc['title'].replace(' ','%20'))

    try:
        content_check = tmp_doc['content']
    except KeyError:
        tmp_doc['content'] = ''

    try:
        content_text_check = tmp_doc['content_text']
    except KeyError:
        tmp_doc['content_text'] = tmp_doc['content'].encode('utf-8')

    try:
        mimetype_check = tmp_doc['mimetype']
    except KeyError:
        tmp_doc['mimetype'] = ''

    try:
        http_status_check = tmp_doc['http_status']
    except KeyError:
        tmp_doc['http_status'] = ''
    
    try:
        tags_check = tmp_doc['tags']
    except KeyError:
        tmp_doc['tags'] = []
    
    try:
        slugs_check = tmp_doc['slugs']
    except KeyError:
        tmp_doc['slugs'] = []
		
    try:
        all_check = tmp_doc['all']
    except KeyError:
        tmp_doc['all'] = []

    tmp_doc['id'] = str(tmp_doc['id'])
    tmp_doc['is_public'] = str(tmp_doc['is_public'])
    tmp_doc['user_id'] = str(tmp_doc['user_id'])
    tmp_doc['http_status'] = str(tmp_doc['http_status'])
    tmp_doc['tags'] = tmp_doc['tags']
    tmp_doc['slugs'] = tmp_doc['slugs']
    tmp_doc['all'] = tmp_doc['all']
    tmp_doc['links'] = tmp_doc['_links']
    #print(tmp_doc['links'])
    
    try:
        del tmp_doc['_links']
    except KeyError:
        print("No _links key to delete")
    
    try:
        del tmp_doc['published_by']
    except KeyError:
        #print("No published_by key to delete")
        pass
       
    try:
        del tmp_doc['published_at']
    except KeyError:
        #print("No published_at key to delete")
        pass
    
    try:
        del tmp_doc['uid']
    except KeyError:
        #print("No uid key to delete")
        pass
    
    try:
       tmp_doc['content_text'] = tmp_doc['content_text'].decode()
    except (UnicodeDecodeError, AttributeError):
        pass 
    
    if i%(real_docs/10.0)==0:
        print(str(i/(real_docs/100.0))+" % complete")
    

    json_doc = str(json.dumps(tmp_doc))
    #print(json_doc)
    insert_query = session.execute(
        "INSERT INTO "+cred['keyspace']+'.'+cred['table']+" JSON %s" % "'"+json_doc.replace("'","''")+"'"
        )