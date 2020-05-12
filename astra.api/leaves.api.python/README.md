# Python REST API

## Getting Started 

These instructions will get your Python REST API using Astra up and running locally and on the cloud.
Before using this API, run the data importer first so that you have data in your database.

### Prerequisites

- Python 2.7.17 or Python 3
- Python cassandra-driver
- Python requests
- Python flask

run the following command:

```sh
pip install -r requirements.txt
```

### Setup for Both Local and Cloud Deployment

- Before reaching this step you should have created your Astra account and you should have already added your connection details to the "astra.credentials" directory. If not, please go back to the root directory and follow the instructions detailed in the readme there.
- You also need to add your credentials to the UserCred.json file in "cassandra.api/astra.credentials/" directory. Right now it has the example naming conventions that are stated in the main readme so if you used different conventions be sure to change those.
- Depending on the setup of your local machine's PATH, enviroment variable, you may need to edit lines 10, 13, 27 to inlcude the full paths for each file/folder the program is looking for.

```sh
line 10: with open('../../astra.credentials/UserCred.json') as f:
line 13: 'secure_connect_bundle': '../../astra.credentials/secure-connect-'+cred['cluster']+'.zip'
line 27: f = open('../../astra.import/AstraTableDef')
```

## Running the API Locally

Run the script with the following command:
```sh
python app.py
```

Navigate to `localhost:8000/api/leaves` to view all of the data in your astra database table.

Navigate to `localhost:8000/api/leaves/(id)` to view a single row from your table with the proper id.

## Running the API on Gitpod

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/anant/cassandra.api.git)

Use the sidebar to navigate to astra.api/leaves.api.python/src and open app.py

![ObiImg](Assets/../../../Assets/Images/ObiImg4.png)

Hit the run button in the upper left or type ‘python3 astra.api/leaves.api.python/src/app.py’ into the terminal and hit enter. A popup will open in the lower right, telling you about a service on port 80.

![ObiImg](Assets/../../../Assets/Images/ObiImg5.png)

Press the make public button

![ObiImg](Assets/../../../Assets/Images/ObiImg6.png)

Press the open browser button. This will open a new tab and navigate to a 404 page.

![ObiImg](Assets/../../../Assets/Images/ObiImg7.png)

Add /api/leaves to the end of that url and navigate to that page. It should contain a list of all of the rows put into your astra table via the data importer. During this step grab the id of at least one entry. (in this case the id is 13952)

![ObiImg](Assets/../../../Assets/Images/ObiImg8.png)

Add that id to then end of the url, so that it looks like this [gitpod generated url]/api/leaves/[chosen id] in this case /api/leaves/13952 and navigate to the new url. This will show an individual entry from your astra database.

![ObiImg](Assets/../../../Assets/Images/ObiImg9.png)

## Built With

* [Python](https://www.python.org/) - Language & Compiler Used
* [CQLSH](https://docs.datastax.com/en/astra/aws/doc/dscloud/astra/dscloudConnectcqlshConsole.html) - Connecting to Astra databases using CQLSH

## Contributing

## Versioning
0.1

## Authors
* **Obi** - *Initial work*


See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.