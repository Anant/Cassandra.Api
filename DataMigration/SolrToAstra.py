from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider
import json
import requests
from datetime import  datetime

#Connect to Astra Cluster
#Redo this after git project restructuring
with open('/workspace/leaves.astra/DataMigration/UserCred.json') as f:
    cred = json.load(f)
cloud_config= {
        'secure_connect_bundle': '/workspace/leaves.astra/DataMigration/secure-connect-'+cred['keyspace']+'.zip'
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
f = open('/workspace/leaves.astra/DataMigration/AstraTableDef')
session.execute('CREATE TABLE IF NOT EXISTS '+str(f.read()))

#Request data from solr
params = (
    ('fl', '*'),
    ('q', '*'),
    ('rows', '10'),
)

response = requests.get('https://ss346483-us-east-1-aws.searchstax.com/solr/leaves_anant_stage/select', params=params)
response_json = response.json()
num_docs = response_json['response']['numFound']
docs = response_json['response']['docs']


print(str(len(docs))+'/'+str(num_docs))


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
        tmp_doc['content_text'] = str(tmp_doc['content'])

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

    insert_query = session.prepare(
        """
        INSERT INTO killrvideo.leaves 
        (is_archived, 
        all, 
        is_starred, 
        user_name, 
        user_email, 
        user_id, 
        tags, 
        slugs, 
        is_public, 
        id, 
        title, 
        url, 
        content_text, 
        created_at, 
        updated_at, 
        mimetype, 
        language, 
        reading_time, 
        domain_name, 
        preview_picture, 
        http_status, 
        links, 
        content)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""")
    session.execute(insert_query, 
        [
            tmp_doc['is_archived'],
            str(tmp_doc['all']),
            tmp_doc['is_starred'],
            str(tmp_doc['user_name']),
            str(tmp_doc['user_email']),
            str(tmp_doc['user_id']),
            str(tmp_doc['tags']),
            str(tmp_doc['slugs']),
            str(tmp_doc['is_public']),
            int(tmp_doc['id']),
            str(tmp_doc['title']),
            str(tmp_doc['url']),
            str(tmp_doc['content_text']),
            datetime.strptime(tmp_doc['created_at'],'%Y-%m-%dT%H:%M:%SZ'),
            datetime.strptime(tmp_doc['updated_at'],'%Y-%m-%dT%H:%M:%SZ'),
            str(tmp_doc['mimetype']),
            str(tmp_doc['language']),
            int(tmp_doc['reading_time']),
            str(tmp_doc['domain_name']),
            str(tmp_doc['preview_picture']),
            str(tmp_doc['http_status']),
            str(tmp_doc['_links']),
            str(tmp_doc['content']),
        ])