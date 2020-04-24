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
session.set_keyspace('killrvideo')
f = open('astra.import/schema/AstraTableDef')
session.execute('CREATE TABLE IF NOT EXISTS '+str(f.read()))
rows = 1


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

    tmp_doc['is_public'] = str(tmp_doc['is_public'])
    tmp_doc['user_id'] = str(tmp_doc['user_id'])
    tmp_doc['http_status'] = str(tmp_doc['http_status'])
    tmp_doc['tags'] = str(tmp_doc['tags'])
    tmp_doc['slugs'] = str(tmp_doc['slugs'])
    tmp_doc['all'] = str(tmp_doc['all'])
    tmp_doc['links'] = str(tmp_doc['_links'])
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
    
#    if i%(real_docs/10)==0:
#        print(str(i/(real_docs/100))+" % complete")
    
    json_doc = str(json.dumps(tmp_doc))
    print(json_doc)
    insert_query = session.execute(
        "INSERT INTO killrvideo.leaves JSON %s" % "'"+json_doc.replace("'","''")+"'"
        )
    """insert_query = session.execute(
        "INSERT INTO killrvideo.leaves(is_archived, all, is_starred, user_name, user_email, user_id, tags, slugs, is_public, id, title, url, content_text, created_at, updated_at, mimetype, language, reading_time, domain_name, preview_picture, http_status, links, content) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",(
            tmp_doc['is_archived'],
            [tmp_doc['all']],
            tmp_doc['is_starred'],
            tmp_doc['user_name'],
            tmp_doc['user_email'],
            tmp_doc['user_id'],
            tmp_doc['tags'],
            tmp_doc['slugs'],
            tmp_doc['is_public'],
            tmp_doc['id'],
            tmp_doc['title'],
            tmp_doc['url'],
            tmp_doc['content_text'],
            datetime.strptime(tmp_doc['created_at'],'%Y-%m-%dT%H:%M:%SZ'),
            datetime.strptime(tmp_doc['updated_at'],'%Y-%m-%dT%H:%M:%SZ'),
            tmp_doc['mimetype'],
            tmp_doc['language'],
            tmp_doc['reading_time'],
            tmp_doc['domain_name'],
            tmp_doc['preview_picture'],
            tmp_doc['http_status'],
            tmp_doc['_links'],
            tmp_doc['content'],
        ))"""
