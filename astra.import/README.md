# Data Migrator

## Getting Started

These instructions will get you started migrating data from Leaves to your Astra cluster.

### Prerequisites

- Python 2.7.17
- Python cassandra-driver
- Python requests

**2.1.1** Run the following commands:
```
pip3 install cassandra-driver
pip3 install requests
```

OR 

```sh
pip install -r requirements.txt
```

### Getting Started 

- Create your database on DataStax Astra (Be sure to remember your keyspace name, username, and password as those will be useful later on)
- Clone this repo either locally or on Gitpod
- Download the 'secure connect bundle' zip from your Astra dashboard, and place it in the "cassandra.api/astra.credentials/" folder. 
- Depending on the setup of your local machine's PATH, you may need to edit lines 10, 13, 27 to include the full paths for each file/folder the program is looking for.


```
line 10: with open('astra.credentials/UserCred.json') as f:
line 13: 'secure_connect_bundle': 'astra.credentials/secure-connect-'+cred['cluster']+'.zip'
line 27: f = open('astra.import/Leaves.Astra.cql')
```


## Running the Program Locally

**2.1.2** Run the migrator from the **cassandra.api/** folder

```
python3 astra.import/RESTToAstra.py
```

* If you recieve the following, you're most likely using python 2, switch to python 3 and retry.

```
 File "c:/Users/adp8k/Desktop/migrator-test/astra.import/SolrToAstra.py", line 140, in <module>
    "INSERT INTO killrvideo.leaves JSON %s" % "'"+json_doc.replace("'","''")+"'"
  File "C:\Python27\lib\site-packages\cassandra\cluster.py", line 2615, in execute
    return self.execute_async(query, parameters, trace, custom_payload, timeout, execution_profile, paging_state, host, execute_as).result()
  File "C:\Python27\lib\site-packages\cassandra\cluster.py", line 4871, in result
    raise self._final_exception
cassandra.InvalidRequest: Error from server: code=2200 [Invalid query] message="Error decoding JSON value for links: Error decoding JSON string: Unrecognized token 'u': was expecting ('true', 'false' or 'null')
 at [Source: (String)"[u'/api/entries/14012']"; line: 1, column: 3]"
```


## Running the program on Gitpod

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/anant/cassandra.api.git)

![ObiImg](Assets/../../Assets/Images/ObiImg1.png)

**2.1.3** Use the sidebar to navigate to and open RESTToAstra.py

![ObiImg](Assets/../../Assets/Images/ObiImg2.png)

Change the rows variable on line 32 to reflect the number of rows you want copied over. (max of 11211) Hit the run button in the upper left or type ``python3 astra.import/data/RESTToAstra.py`` into the terminal and hit enter

![ObiImg](Assets/../../Assets/Images/ObiImg3.png)

## Built With

* [Python](https://www.python.org/) - Language & Compiler Used
* [CQLSH](https://docs.datastax.com/en/astra/aws/doc/dscloud/astra/dscloudConnectcqlshConsole.html) - Connecting to Astra databases using CQLSH

## Contributing

## Versioning


## Authors

* **Obi** - *Initial work*

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.