from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider
import json
import requests

#Connect to Astra Cluster
cloud_config= {
        'secure_connect_bundle': '/workspace/leaves.astra/DataMigration/secure-connect-killrvideocluster.zip'
}
auth_provider = PlainTextAuthProvider('KVUser', 'KVPassword')
cluster = Cluster(cloud=cloud_config, auth_provider=auth_provider)
session = cluster.connect()

row = session.execute("select release_version from system.local").one()
if row:
    print(row[0])
else:
    print("An error occurred.")

#Create Table leaves if it does not exist
session.set_keyspace('killrvideo')
session.execute(
    """
    CREATE TABLE IF NOT EXISTS killrvideo.leaves(
        id int,
        user_name text,
        title text,
        url text,
        is_archived int,
        is_starred int,
        content	 text,
        create_at timestamp,
        update_at timestamp,
        mimetype text,
        language text,
        reading_time int,
        domain_name text,
        preview_picture text,
        uid text,
        http_status text,
        published_at timestamp,
        published_by text,
        headers text,
        starred_at timestamp,
        origin_url text,
        PRIMARY KEY (id)
    )
    """
)

#Request data from solr
params = (
    ('fl', '*'),
    ('q', '*'),
)

response = requests.get('https://ss346483-us-east-1-aws.searchstax.com/solr/leaves_anant_stage/select', params=params)
response_json = response.json()
#print(type(response_json))
#print(response_json.keys())
#print((response_json['response']).keys())
num_docs = response_json['response']['numFound']
#print(num_docs)
docs = response_json['response']['docs']
#print(type(docs))
#print((docs[0]).keys())

for i in range(len(docs)):
    tmp_doc = docs[i]
    session.execute(
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
        _links, 
        content)
        VALUES (%s, %s, %s)
        """,
    ("John O'Reilly", 42, uuid.uuid1())
)