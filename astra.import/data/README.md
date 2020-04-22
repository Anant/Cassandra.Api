# Project Title

## Getting Started with the Data Migrator

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project Gitpod.

### Prerequisites

Python 2.7.17
Python cassandra-driver
Python requests

```
pip install cassandra-driver
pip install requests
```

### Setup

- Create your database on DataStax Astra (Be sure to remmeber your keyspace name, username and password as those will be useful later on)
- Clone this repo
- Download the connection-details zip file from your Astra dashboard and place it in the "astra.credentials" folder. 
- Depending on the setup of your PATH env varible, you may need to edit lines 10, 13, 27 to inlcude the full paths for each file/folder the program is looking for.

```
line 10: with open('../../astra.credentials/UserCred.json') as f:
line 13: 'secure_connect_bundle': '../../astra.credentials/secure-connect-'+cred['cluster']+'.zip'
line 27: f = open('../../astra.import/schema/AstraTableDef')
```


## Running the Program Locally

Run the script with the following command:
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

TBD

## Built With

* [Python](https://www.python.org/) - Language & Compiler Used
* [CQLSH](https://docs.datastax.com/en/astra/aws/doc/dscloud/astra/dscloudConnectcqlshConsole.html) - Connecting to Astra databases using CQLSH

## Contributing

## Versioning


## Authors

* **Obi** - *Initial work*

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.