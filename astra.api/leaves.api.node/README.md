# Leaves.Astra API (Node)

Nodejs REST API using DataStax Astra with NoSQL, and Apache Cassandra™ in the cloud!

## Getting Started

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/xingh/leaves.astra.git)

leaves.astra/astra.api/leaves.api.node

* `npm install`

* `npm start` or `npm run dev` (Start application in development using [nodemon](https://www.npmjs.com/package/nodemon))

Navigate to:

(Local) `localhost:8000/api/leaves`

(Gitpod): Once started, an alert will apear. Click "Open Browser"

![Alt Img](Assets/../../../Assets/Images/gitpodNode.png)

Add `/api/leaves` to Gitpod url

## Endpoints (Ongoing/Subject to change)

* `/api/leaves`
    * `GET` -> (**WORKING + TESTED**) Returns items from the KEYSPACE.leaves table
    * `POST` -> (**TBD AND UNTESTED TO LEAVES DB**) Creates a new item in the KEYSPACE.leaves table

* `/api/leaves/:id`
    * `GET` -> (**WORKING + TESTED**) Returns single item based on id parameter from KEYSPACE.leaves table
    * `PATCH` -> (**TBD AND UNTESTED TO LEAVES DB**) Updates an item in KEYSPACE.leaves table based on id parameter and request body
    * `Delete` -> (**WORKING + TESTED**) Deletes an item in KEYSPACE.leaves table based on id parameter