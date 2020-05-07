# Data Migrator

## Getting Started

These instructions will get you started migrating data from Leaves to your Astra cluster.

### Prerequisites

- Python 2.7.17
- Python cassandra-driver
- Python requests

```
pip3 install cassandra-driver
pip3 install requests
```

OR 

```sh
pip install -r requirements.txt
```

### Getting started (Locally)

- Create your database on DataStax Astra (Be sure to remember your keyspace name, username, and password as those will be useful later on)
- Clone this repo
- Download the 'secure connect bundle' zip from your Astra dashboard, and place it in the "leaves.astra/astra.credentials/" folder. 
- Depending on the setup of your local machine's PATH, you may need to edit lines 10, 13, 27 to include the full paths for each file/folder the program is looking for.


```
line 10: with open('astra.credentials/UserCred.json') as f:
line 13: 'secure_connect_bundle': 'astra.credentials/secure-connect-'+cred['cluster']+'.zip'
line 27: f = open('astra.import/schema/AstraTableDef')
```


## Running the Program (Locally)

Run the migrator from the **leaves.astra/** folder

```
python3 astra.import/data/RESTToAstra.py
```

* If you recieve the following, you're most likely using python 2, switch to python 3 and retry.

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
