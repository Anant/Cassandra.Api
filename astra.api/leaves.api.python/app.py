from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider
import json
import requests
from datetime import  datetime
from flask import Flask, jsonify, request, abort, Response
import hashlib
from bs4 import BeautifulSoup
import re
import readtime

def processURL(url):
    page = requests.get(url)
    mimetype = page.headers['content-type']
    http_status = str(page.status_code)
    
    id = hashlib.md5(url.encode()).hexdigest()
    is_archived = 1
    is_starred = 0
    user_name = 'admin'
    user_email = 'rahul@example.com'
    user_id = str(1)
    is_public = str(False)
    domain_name = re.search('https?:\/\/[^#?\/]+',url).group(0)
    #domain_name = re.compile(r"https?://(www\.)?").sub('', domain_name).strip().strip('/')
    created_at = str(datetime.now())[:-3]
    updated_at = str(datetime.now())[:-3]
    links = ["api/entries/"+str(id)]
    tags = str([])
    slugs = tags

    bs = BeautifulSoup(page.content, 'html.parser')
    images = bs.find_all('img', {'src':re.compile('.jpg')})
    title = str(bs.title.string)
    if images == []:
        preview_picture = 'https://dummyimage.com/170/000/ffffff&text='+(title.replace(' ','%20'))
    else:
        preview_picture = images[0]['src']
    language = bs.lang
    if language == None:
        language = 'en'
    content = str(bs)
    content_text = bs.text
    reading_time = str(readtime.of_html(str(bs)).minutes)
    result = {'is_archived':is_archived, 'is_starred':is_starred, 'user_name':user_name,'user_email':user_email, 'user_id':user_id, 'tags':tags, 'slugs':slugs,
    'is_public':is_public, 'id':id, 'title':title, 'url':url, 'content_text':content_text, 'created_at':created_at, 'updated_at':updated_at, 'mimetype':mimetype,
    'language':language, 'reading_time':reading_time, 'domain_name':domain_name, 'preview_picture':preview_picture, 'http_status':http_status, 'links':links, 
    'content':content, 'id':id}
    all = list(result.values())
    all = [str(i) for i in all]
    result['all'] = all
    #print(result.keys())
    #print([type(i) for i in result.values()])
    print(id)
    return result


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

@app.route('/api/leaves',methods=['POST'])
def pushRow():
    req_data = request.get_json()
    processed_data =processURL(req_data['url'])
    doc = str(json.dumps(processed_data))
    id = processed_data['id']
    #print(doc)
    session.execute("INSERT INTO "+cred['keyspace']+'.'+cred['table']+" JSON %s" % "'"+doc.replace("'","''")+"'")
    rows = session.execute("SELECT JSON * FROM "+cred['keyspace']+'.'+cred['table']+" WHERE id=%s",[id])
    #print(type(rows))
    result = []
    for row in rows:
        #print(type(str(row)))
        result.append(json.loads(row.json))
    return jsonify(result[0]), 201

@app.route('/api/leaves/<id>',methods=['GET'])
def getById(id):
    rows = session.execute("SELECT JSON * FROM "+cred['keyspace']+'.'+cred['table']+" WHERE id=%s",[str(id)])
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
    rows = session.execute("DELETE FROM "+cred['keyspace']+'.'+cred['table']+" WHERE id=%s",[str(id)])
    print(rows)
    result = ''
    for row in rows:
        #print(type(str(row)))
        result = json.loads(row.json)
    if(result == ''):
        abort(404)
    else:
        return jsonify(result)

@app.route('/api/leaves/<id>',methods=['PATCH'])
def patchById(id):
    response = session.execute("SELECT JSON * FROM "+cred['keyspace']+'.'+cred['table']+" WHERE id=%s",[str(id)])
    row = json.loads(response.one().json)
    req_data = request.get_json()
    for i in req_data.items():
        row[str(i[0])] = i[1]
    row['slugs'] = row['tags']
    del row['all']
    row['all'] = [str(i) for i in list(row.values())]
    session.execute("DELETE FROM "+cred['keyspace']+'.'+cred['table']+" WHERE id=%s",[str(id)])
    rows = session.execute("INSERT INTO "+cred['keyspace']+'.'+cred['table']+" JSON %s" % "'"+str(json.dumps(row)).replace("'","''")+"'")
    rows = session.execute("SELECT JSON * FROM "+cred['keyspace']+'.'+cred['table']+" WHERE id=%s",[str(id)])
    result = []
    for row in rows:
        result.append(json.loads(row.json))
    return jsonify(result[0]), 201

@app.route('/api/leaves/<id>/tags',methods=['GET'])
def getTagsById(id):
    rows = session.execute("SELECT JSON tags FROM "+cred['keyspace']+'.'+cred['table']+" WHERE id=%s",[str(id)])
    result = ''
    for row in rows:
        #print(type(str(row)))
        result = json.loads(row.json)
    if(result == ''):
        abort(404)
    else:
        return jsonify(result['tags'])

@app.route('/api/leaves/<id>/tags',methods=['POST'])
def putTagsById(id):
    req_data = request.get_json()
    tags = req_data['tags']
    tags = [i.replace(' ','.') for i in tags]
    print(tags)
    if session.execute("SELECT JSON tags FROM "+cred['keyspace']+'.'+cred['table']+" WHERE id=%s",[str(id)]).one() == None:
        rows = session.execute("UPDATE "+cred['keyspace']+'.'+cred['table']+" SET tags = %s WHERE id=%s",[tags,str(id)])
    else:
        rows = session.execute("UPDATE "+cred['keyspace']+'.'+cred['table']+" SET tags = tags + %s WHERE id=%s",[tags,str(id)])

    if session.execute("SELECT JSON slugs FROM "+cred['keyspace']+'.'+cred['table']+" WHERE id=%s",[str(id)]).one() == None:
        rows = session.execute("UPDATE "+cred['keyspace']+'.'+cred['table']+" SET slugs = %s WHERE id=%s",[tags,str(id)])
    else:
        rows = session.execute("UPDATE "+cred['keyspace']+'.'+cred['table']+" SET slugs = slugs + %s WHERE id=%s",[tags,str(id)])
    result = ''
    for row in rows:
        #print(type(str(row)))
        result = json.loads(row.json)
    rows = session.execute("SELECT JSON * FROM "+cred['keyspace']+'.'+cred['table']+" WHERE id=%s",[str(id)])
    result = []
    for row in rows:
        result.append(json.loads(row.json))
    return jsonify(result[0]), 201

@app.route('/api/leaves/<id>/tags',methods=['DELETE'])
def delTagsById(id):
    rows = session.execute("DELETE tags FROM "+cred['keyspace']+'.'+cred['table']+" WHERE id=%s",[str(id)])
    rows = session.execute("DELETE slugs FROM "+cred['keyspace']+'.'+cred['table']+" WHERE id=%s",[str(id)])
    result = ''
    for row in rows:
        #print(type(str(row)))
        result = json.loads(row.json)
    rows = session.execute("SELECT JSON * FROM "+cred['keyspace']+'.'+cred['table']+" WHERE id=%s",[str(id)])
    result = []
    for row in rows:
        result.append(json.loads(row.json))
    return jsonify(result[0]), 200

#processURL('https://github.com/Anant/cassandra.api')
app.run(port=8000,debug=True)
#print(session.execute("SELECT JSON * FROM "+cred['keyspace']+'.'+cred['table']+" WHERE id=%s",["897ad25b3dc170fae9f72cd07a59517a"]).one().json)
#print(session.execute("SELECT JSON tags FROM "+cred['keyspace']+'.'+cred['table']+" WHERE id=%s",[str(id)]).one())