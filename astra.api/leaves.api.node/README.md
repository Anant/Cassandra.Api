# Leaves.API.Node

This is a demo project used for connecting a REST API to a DataStax Astra Database

## Set up

1. Install the node dependencies `npm install`
2. Move the example Environment file to `.env` that will be ignored by git and read by the express server `mv example.env .env`


## Scripts

**Before starting application**

* Set ASTRA_BUNDLE in .env equal to the Astra Secure Connect Bundle .zip folder name from astra.credentials

* Set ASTRA_USERNAME and ASTRA_PASSWORKD equal to the Astra Credentials associated with the Secure Connect Bundle

```
NODE_ENV=development
PORT=8000
EXAMPLE="example-environmental-variable"
ASTRA_BUNDLE=path/to/zip/in/Astra/Credentials
ASTRA_USERNAME="Example"
ASTRA_PASSWORD="Example"
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