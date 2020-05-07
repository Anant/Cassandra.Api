from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider
import json
import requests
from datetime import  datetime
from flask import Flask, jsonify, request, abort

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

#Go to killrvideo keyspace
session.set_keyspace(cred['keyspace'])

#Create Flask app
app = Flask(__name__)

@app.route('/api/leaves',methods=['GET'])
def getAll():
    rows = session.execute("SELECT JSON * FROM "+cred['keyspace']+'.'+cred['table'])
    #print(type(rows))
    result = []
    for row in rows:
        #print(type(str(row)))
        result.append(json.loads(row.json))
    return jsonify(result)
    
@app.route('/api/leaves&rows=<num_rows>',methods=['GET'])
def getNumRows(num_rows):
    rows = session.execute("SELECT JSON * FROM "+cred['keyspace']+'.'+cred['table']+" LIMIT "+str(num_rows))
    #print(type(rows))
    result = []
    for row in rows:
        #print(type(str(row)))
        result.append(json.loads(row.json))
    return jsonify(result)

@app.route('/api/leaves/<id>',methods=['GET'])
def getById(id):
    rows = session.execute("SELECT JSON * FROM "+cred['keyspace']+'.'+cred['table']+" WHERE id=%s",[int(id)])
    result = ''
    for row in rows:
        #print(type(str(row)))
        result = json.loads(row.json)
    if(result == ''):
        abort(404)
    else:
        return jsonify(result)

@app.route('/api/leaves/<id>',methods=['DELETE'])
def delById(id):
    rows = session.execute("DELETE FROM "+cred['keyspace']+'.'+cred['table']+" WHERE id=%s",[int(id)])
    print(rows)
    result = ''
    for row in rows:
        #print(type(str(row)))
        result = json.loads(row.json)
    if(result == ''):
        abort(404)
    else:
        return jsonify(result)


app.run(port=8000,debug=True)