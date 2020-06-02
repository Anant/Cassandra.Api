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
line 71: with open('../../astra.credentials/UserCred.json') as f:
line 74: 'secure_connect_bundle': '../../astra.credentials/secure-connect-'+cred['cluster']+'.zip'
```

---

## Running the API Locally

Run the script with the following command:
```sh
python app.py
```

Navigate to `localhost:8000/api/leaves` to view all of the data in your astra database table.

Navigate to `localhost:8000/api/leaves/(id)` to view a single row from your table with the proper id.

---

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

## Usage / Testing via Postman

Grab your gitpod-given url add /api/leaves to the end and paste into the url space in postman. Hit the send button. Your response should be a list of all of the entries in your astra table. Grab an id value from one of the entries to use in later steps.

![ObiImg](Assets/../../../Assets/Images/ObiImg10.png)

Test getting single entries by adding the id you got to the end of the url and hit send. This should return that single entry and no others. If you try with an id that is not in the table, you will get a 404 page.

![ObiImg](Assets/../../../Assets/Images/ObiImg11.png)

![ObiImg](Assets/../../../Assets/Images/ObiImg14.png)

The delete postman request is similar to the one that gets a single entry but the parameter to the left of the url is changed to delete

![ObiImg](Assets/../../../Assets/Images/ObiImg12.png)

When run, you will get a 404 page returned.  The get for that id will also start to return 404 pages.

![ObiImg](Assets/../../../Assets/Images/ObiImg13.png)

In order to post new entries, create a POST request with the header, Content-Type application/json and the body of a json entry with the key url and a string containing a url.

![ObiImg](Assets/../../../Assets/Images/ObiImg15.png)

This request will return the entry created from the url in full. It may be a good idea to grab the id generated during the process to use in later steps. In this case the id is 897ad25b3dc170fae9f72cd07a59517a.

![ObiImg](Assets/../../../Assets/Images/ObiImg16.png)

To edit existing entries send a PATCH request to [gitpod generated url]/api/leaves/[chosen id] with the header, Content-Type application/json and the body of a json entry with the keys of fields you wish to change with the desired data as the value.

![ObiImg](Assets/../../../Assets/Images/ObiImg17.png)

This returns the edited entry in full. This changes the "all" field appropriately.

![ObiImg](Assets/../../../Assets/Images/ObiImg18.png)

![ObiImg](Assets/../../../Assets/Images/ObiImg19.png)

In order to retrieve the tags send a get request to [gitpod generated url]/api/leaves/[chosen id]/tags. This will return a list of tags.

![ObiImg](Assets/../../../Assets/Images/ObiImg20.png)

![ObiImg](Assets/../../../Assets/Images/ObiImg21.png)

To add more tags to an entry, send a POST request to [gitpod generated url]/api/leaves/[chosen id]/tags with the header, Content-Type application/json and the body of a json entry with the key tags and the value of a list of desired tags. This also updates the slugs field.

![ObiImg](Assets/../../../Assets/Images/ObiImg22.png)

![ObiImg](Assets/../../../Assets/Images/ObiImg23.png)

![ObiImg](Assets/../../../Assets/Images/ObiImg24.png)

To delete the tags of an entry, send a DELETE request to [gitpod generated url]/api/leaves/[chosen id]/tags. This deletes all of the tags attached to this entry. It returns the entire updated entry but the tags and slugs will both be null.

![ObiImg](Assets/../../../Assets/Images/ObiImg25.png)

![ObiImg](Assets/../../../Assets/Images/ObiImg26.png)

## Usage / Testing via Curl

Starting back in Gitpod, with the api running and start a seperate terminal.

![ObiImg](Assets/../../../Assets/Images/ObiImg27.png)

In order to get a single entry run the command ‘curl localhost:8000/api/leaves/[chosen id]’ in this case the id is 13952. To get all entries, run the command ‘curl localhost:8000/api/leaves’

![ObiImg](Assets/../../../Assets/Images/ObiImg28.png)

![ObiImg](Assets/../../../Assets/Images/ObiImg29.png)

To test delete functionality of the api, run command ‘curl -X DELETE localhost:8000/api/leaves/[chosen id]’. This will print out a simple 404 page to your console.

![ObiImg](Assets/../../../Assets/Images/ObiImg31.png)

To ensure that the delete went through, attempt to return to that entries page in your browser. You should see a 404 page.

![ObiImg](Assets/../../../Assets/Images/ObiImg32.png)

In order to post a new entry, you need to make a POST request to the /api/leaves endpoint with a properly formatted header and body. 'curl -X POST http://localhost:8000/api/leaves -H "Content-Type: application/json" -d '{"url": "https://github.com/Anant/cassandra.api/tree/dev"}'

![ObiImg](Assets/../../../Assets/Images/ObiImg33.png)

This will return the generated entry in full. Grab the generated id for our next steps.

![ObiImg](Assets/../../../Assets/Images/ObiImg34.png)

To edit existing entries send a PATCH request to /api/leaves/[chosen id] with the header, Content-Type application/json and the body of a json entry with the keys of fields you wish to change with the desired data as the value. 'curl -X PATCH http://localhost:8000/api/leaves/897ad25b3dc170fae9f72cd07a59517a -H "Content-Type: application/json" -d '{"tags":["github", "another one"], "is_starred":1}'

![ObiImg](Assets/../../../Assets/Images/ObiImg35.png)

Returns the edited entry in full.

![ObiImg](Assets/../../../Assets/Images/ObiImg36.png)

To get the tags of an entry send a get request to /api/leaves/[chosen id]/tags. Returns a list of tags. 'curl -X GET http://localhost:8000/api/leaves/897ad25b3dc170fae9f72cd07a59517a/tags'

![ObiImg](Assets/../../../Assets/Images/ObiImg37.png)

![ObiImg](Assets/../../../Assets/Images/ObiImg38.png)

To add more tags to an entry, send a POST request to [gitpod generated url]/api/leaves/[chosen id]/tags with the header, Content-Type application/json and the body of a json entry with the key tags and the value of a list of desired tags. This also updates the slugs field. 'curl -X POST http://localhost:8000/api/leaves/897ad25b3dc170fae9f72cd07a59517a/tags -H "Content-Type: application/json" -d '{"tags":["github 2", "another another one"]}'

![ObiImg](Assets/../../../Assets/Images/ObiImg39.png)

Returns the updated version of the full entry associated with this id.

![ObiImg](Assets/../../../Assets/Images/ObiImg40.png)

To delete the tags of an entry, send a DELETE request to [gitpod generated url]/api/leaves/[chosen id]/tags. This deletes all of the tags attached to this entry. It returns the entire updated entry but the tags and slugs will both be null. 'curl -X DELETE http://localhost:8000/api/leaves/897ad25b3dc170fae9f72cd07a59517a/tags'

![ObiImg](Assets/../../../Assets/Images/ObiImg41.png)

![ObiImg](Assets/../../../Assets/Images/ObiImg42.png)

## Contributing

## Versioning
0.1

## Authors
* **Obioma Anomnachi** - *Initial work*


See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.