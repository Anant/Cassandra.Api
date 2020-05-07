# Data Migrator

## Getting Started

These instructions will get you started migrating data from Leaves to your Astra cluster.

### Prerequisites

- Python 2.7.17
- Python cassandra-driver
- Python requests

```
pip3 install flask
pip3 install cassandra-driver
pip3 install requests
```

### Getting started (Locally)

- Create your database on DataStax Astra (Be sure to remember your keyspace name, username, and password as those will be useful later on)
- Clone this repo
- Download the 'secure connect bundle' zip from your Astra dashboard, and place it in the "leaves.astra/astra.credentials/" folder. 
- Depending on the setup of your local machine's PATH, you may need to edit lines 10, 13, 27 to include the full paths for each file/folder the program is looking for.


```
line 10: with open('../../astra.credentials/UserCred.json') as f:
line 13: 'secure_connect_bundle': '../../astra.credentials/secure-connect-'+cred['cluster']+'.zip'
line 27: f = open('../../astra.import/schema/AstraTableDef')
```


## Running the Program (Locally)

Run the migrator using the following script:

```
python SolrToAstra.py
```

If your program produces the following error:

```
 File "c:/Users/adp8k/Desktop/migrator-test/astra.import/data/SolrToAstra.py", line 140, in <module>
    "INSERT INTO killrvideo.leaves JSON %s" % "'"+json_doc.replace("'","''")+"'"
  File "C:\Python27\lib\site-packages\cassandra\cluster.py", line 2615, in execute
    return self.execute_async(query, parameters, trace, custom_payload, timeout, execution_profile, paging_state, host, execute_as).result()
  File "C:\Python27\lib\site-packages\cassandra\cluster.py", line 4871, in result
    raise self._final_exception
cassandra.InvalidRequest: Error from server: code=2200 [Invalid query] message="Error decoding JSON value for links: Error decoding JSON string: Unrecognized token 'u': was expecting ('true', 'false' or 'null')
 at [Source: (String)"[u'/api/entries/14012']"; line: 1, column: 3]"
```

Then you'll need to remove the str() methods around the tmp_doc values on lines 105-108

```
tmp_doc['tags'] = str(tmp_doc['tags'])
tmp_doc['slugs'] = str(tmp_doc['slugs'])
tmp_doc['all'] = str(tmp_doc['all'])
tmp_doc['links'] = str(tmp_doc['_links'])
```

Afterwards, re-run the script again.


## Running the program on Gitpod

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/xingh/leaves.astra.git)

## Built With

* [Python](https://www.python.org/) - Language & Compiler Used
* [CQLSH](https://docs.datastax.com/en/astra/aws/doc/dscloud/astra/dscloudConnectcqlshConsole.html) - Connecting to Astra databases using CQLSH

## Contributing

## Versioning


## Authors

* **Obi** - *Initial work*

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.
