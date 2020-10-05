# Leaves on DataStax Astra™ with NoSQL, and Apache Cassandra™ in the cloud! 

![version](https://img.shields.io/badge/version-0.0.2-blue)

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/anant/cassandra.api.git)

## Table of Contents

1. [Astra Setup & Configuring Credentials](#setup) 
2. [Getting Started](#Getting-Started)
	1. [Running Data Migrator](#Data-Migrator)
	2. [Node JS](#Node-js)
	3. [Python](#python)
	4. [Running Unit Tests](#testing)
	5. [Running Admin UI](#admin-ui)
  
---

## Setup

### 1.1 Create Account

- Before you start using our tools, you'll need to create an account on [DataStax Astra](https://dtsx.io/workshop)

![Astra](https://github.com/datastaxdevs/shared-assets/blob/master/astra/login-1000.png?raw=true)

### 1.2 Create New Database

- You'll then be directed to the home page. Locate the button `Add Database` 

![Astra](https://github.com/datastaxdevs/shared-assets/blob/master/astra/dashboard-empty-1000.png?raw=true)

- Define the free plan and and pick a region close to you 

![Astra](https://github.com/datastaxdevs/shared-assets/blob/master/astra/choose-a-plan-1000-annotated.png?raw=true)

- Fill the databases parameters.

![Astra](https://github.com/datastaxdevs/shared-assets/blob/master/astra/create-and-configure-annotated-1000.png?raw=true)

- View your database. It may take 2-3 minutes for your database to spin up. You will receive an email at that point.

**Expected output**

*Initializing*

![my-pic](https://github.com/datastaxdevs/shared-assets/blob/master/astra/dashboard-pending-1000.png?raw=true)

Database is ready, notice how the status changed from `pending` to `Active` and now you now have the **connect** button enabled.*


### 1.3 Go To Connections Panel

- Get your secure connect bundle.
- To do so, access your connections panel by clicking the `connect` button.

![pic](https://github.com/datastaxdevs/shared-assets/blob/master/astra/summary-1000-connect.png?raw=true)

- On the connect screen pick `drivers`

![pic](https://github.com/datastaxdevs/shared-assets/blob/master/astra/connect-rest-driver.png?raw=true)

### 1.4 Download Secure Connect Bundle

- Finally, click the Download Secure Connect Bundle button to download the zip. Once saved, move the zip into the `cassandra.api/astra.credentials` directory of this project.

![pic](https://github.com/datastaxdevs/shared-assets/blob/master/astra/connect-driver-1000.png?raw=true)

### 1.5 Configure Cassandra.API Connection

- Fill in the naming conventions you declared earlier, when you setup your database, in your ***(cassandra.api/astra.credentials/UserCred.json) file***
- The following is an example of that the UserCred.json file would look like using the credentials used for configuring the Astra instance.

```
{ 
    "username":"kvuser", 
    "password":"kvpassword", 
    "cluster":"test", 
    "keyspace":"demo", 
    "table":"leaves"
}
```

The last value ``table`` wasn't declared before so you can do that here for the first time.

---

## Getting Started

***It's best to go through this project in the following order so you do not get confused.***



### 2.1 Run the data migrator to transfer data from our cassandra.api to your Astra Database.

#### [Data Migrator](https://github.com/Anant/cassandra.api/tree/master/astra.import)



### 2.2 Setup an API so that you can communicate with your Astra database. We have 2 APIs for you to use:


#### [Node JS](https://github.com/Anant/cassandra.api/tree/master/astra.api/leaves.api.node)


#### [Python](https://github.com/Anant/cassandra.api/tree/master/astra.api/leaves.api.python)



### 2.3 Run this set of unit tests against your API to confirm that it is working properly.

#### [Testing](https://github.com/Anant/cassandra.api/tree/master/astra.api/leaves.api.tests)


### 2.4 Launch Web Admin UI to visualize your Astra Database in Table Format

#### [Admin UI](https://github.com/Anant/cassandra.api/tree/master/astra.ui)


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
