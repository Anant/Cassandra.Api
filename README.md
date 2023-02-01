# Leaves on DataStax Astra™ with NoSQL, and Apache Cassandra™ in the cloud! 

![version](https://img.shields.io/badge/version-0.0.2-blue)

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/anant/cassandra.api.git)

## Table of Contents

1. [Astra Setup & Configuring Credentials](#setup) 
2. [Getting Started](#Getting-Started)
	1. [Running Data Migrator](#Data-Migrator)
	2. [Python](#python)

---

## Setup

### 1.1 Create Astra Account

- Before you start using our tools, you'll need to create an account on [DataStax Astra](https://astra.datastax.com/)

### 1.2 Create New Database

- You'll then be directed to the home page. Locate the `Create Database` button on the left side: 

- On the following screen, enter the Database Name as "db1" and the Keyspace Name as "ks1". Select any of the providers at the bottom and select the region closest to you. Then press `Create Database`.

- Now wait a few minutes for the database to spin up, and click on `Go to Database` on the right side of the screen.

- Database will now get ready, notice how the status changed from `pending` to `Active` and now you now have the `connect` button enabled.


### 1.3 Finding Secure Connect Bundle

- To get your secure connect bundle, press the blue `Connect` button at the top right corner, and then select "Python" under drivers and then`Download Bundle`.


### 1.4 Download Secure Connect Bundle

- Finally, click the `Download Secure Bundle` button to download the zip. Once saved, move the zip into the `cassandra.api/astra.credentials` directory of this project.

### 1.5 Generate Tokens For Database

- In the top left corner, press the arrow next to the "Current Organization" name and go to `Organization Settings`.
- Navigate to Token Management, Select the role "Administrator User" and press `Generate Token`. 
- Before leaving this page, make sure to save these three values into a text document (or press the 'Download CSV' button)

### 1.6 Configure Cassandra.API Connection

- Fill in the naming conventions you declared earlier, when you setup your database, in your ***(cassandra.api/astra.credentials/UserCred.json) file***
-- For Username, input your generated Client ID (from Token Management)
-- For Password, input your generated Client Secret
-- For cluster, input "db1" or the name of the database that you created
-- For keyspace, input "ks1" or the name of the keyspace that you created
-- For table, inpit "leaves"
-- The following is an example of that the UserCred.json file would look like using the credentials used for configuring the Astra instance.

```
{ 
    "username":"your-client-id", 
    "password":"your-client-secret", 
    "cluster":"db1", 
    "keyspace":"ks1", 
    "table":"leaves"
}
```

---

## Getting Started



### 2.1 Run the data migrator to transfer data from our cassandra.api to your Astra Database.

These instructions will get you started migrating data from Leaves to your Astra cluster.

**2.1.1** Run the following commands:
```
pip3 install cassandra-driver
pip3 install requests
```

OR 

```
cd astra.import/
pip install -r requirements.txt
```

**2.1.2** Run the migrator from the **cassandra.api/** folder

```
python3 astra.import/RESTToAstra.py
```

* If you recieve the following error, you're most likely using python 2, switch to python 3 and retry.

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

### 2.2 Setup the Python API so that you can communicate with your Astra database

These instructions will get your Python REST API using Astra up and running locally and on the cloud.

### Prerequisites

- Python 2.7.17 or Python 3
- Python cassandra-driver
- Python requests
- Python flask
- Python flask-cors

**2.3.1** Run the following command:

```sh
cd astra.api/leaves.api.python/
pip3 install -r requirements.txt
```

**2.3.2** Run the script with the following command:
```sh
python3 app.py
```

- Now, navigate to the `PORTS` tab next to `TERMINAL` in your Gitpod screen.
- Ensure that the link is publically available by checking that the "lock" icon is in an unlocked state.
- Open the URL in a new tab by clicking on the link under the "Address" section.
- You will have to append `/api/leaves` to the end of the URL else you will get a 404 error. For example, your URL should look like `https://8000-anant-cassandraapi-aj3adn7scfj.ws-us84.gitpod.io/api/leaves`
- You can also navigate to `/api/leaves/(id)` to view a single row from your table with the proper id.
---
## Reference Material

[Cassandra.API Documentation Walkthrough](https://youtu.be/ZuIjoL60Ad4)

[Cassandra.API Blog Post: Part 1](https://blog.anant.us/setting-up-your-datastax-astra-instance-with-cassandra-api/)

[Cassandra.API Blog Post: Part 2](https://blog.anant.us/new-features-to-cassandra-api/)

[Building a REST API with DataStax Astra using Node & Python: Part 1](https://blog.anant.us/building-a-rest-api-with-cassandra-on-datastax-astra-using-python-and-node/)

[Building a REST API with DataStax Astra using Node & Python: Part 2](https://blog.anant.us/developer-workshop-building-a-rest-api-with-cassandra-using-python-and-node/)

[Cassandra.API Live Workshop w/DataStax](https://www.youtube.com/watch?v=kRYMwOl6Uo4&list=PL2g2h-wyI4SqcSXuShseNQnHMAWl0SF4q&index=2&t=0s)

[Cassandra.API Video Demo: Part 1](https://www.youtube.com/watch?v=O64pJa3eLqs)

[Cassandra.API Video demo: Part 2](https://www.youtube.com/watch?v=j2B_1_yv3CM&feature=youtu.be)
