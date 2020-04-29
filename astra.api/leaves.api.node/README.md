# Leaves.API.Node

This is a demo project used for connecting a REST API to a DataStax Astra Database

## Set up

Complete the following steps to start a new project (NEW-PROJECT-NAME):

1. Install the node dependencies `npm install`
2. Move the example Environment file to `.env` that will be ignored by git and read by the express server `mv example.env .env`


## Scripts

**Before starting application**

* Set BUNDLE in .env equal to Astra Secure Connect Bundle .zip file name 

* Set USER and PASS equal to Astra Credentials

```
NODE_ENV=development
PORT=8000
EXAMPLE="example-environmental-variable"
BUNDLE=secure-connect-example.zip
USER="Example"
PASS="Example"
```

Start the application `npm start`

Start nodemon for the application `npm run dev`


## Endpoints (thus far / subject to change)

* `/api/leaves`
    * `GET` -> (**WORKING + TESTED**) Returns items from the KEYSPACE.leaves table
    * `POST` -> (**TBD AND UNTESTED TO LEAVES DB**) Creates a new item in the KEYSPACE.leaves table

* `/api/leaves/:id`
    * `GET` -> (**WORKING + TESTED**) Returns single item based on id parameter from KEYSPACE.leaves table
    * `PATCH` -> (**TBD AND UNTESTED TO LEAVES DB**) Updates an item in KEYSPACE.leaves table based on id parameter and request body
    * `Delete` -> (**WORKING + TESTED**) Deletes an item in KEYSPACE.leaves table based on id parameter