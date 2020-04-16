from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider
import json
import requests
from datetime import  datetime
from flask import Flask, jsonify, request

#Connect to Astra Cluster
#Redo this after git project restructuring
with open('/workspace/leaves.astra/astra.credentials/UserCred.json') as f:
    cred = json.load(f)
cloud_config= {
        'secure_connect_bundle': '/workspace/leaves.astra/astra.credentials/secure-connect-'+cred['cluster']+'.zip'
}
auth_provider = PlainTextAuthProvider(cred['username'], cred['password'])
cluster = Cluster(cloud=cloud_config, auth_provider=auth_provider)
session = cluster.connect()

row = session.execute("select release_version from system.local").one()
if row:
    print(row[0])
else:
    print("An error occurred.")

#Go to killrvideo keyspace
session.set_keyspace('killrvideo')

#Create Flask app
app = Flask(__name__)

@app.route('/api/leaves/',methods=['GET'])
def getAll():
    rows = session.execute("SELECT * FROM killrvideo.leaves")
    print(type(rows))
    return jsonify(rows)


app.run(port=8001,debug=True)