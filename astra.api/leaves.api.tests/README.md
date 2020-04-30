# Leaves.API.Test

This is test code to run against the Leaves.API at localhost:8000

## Set up

Complete the following steps to start testing the Leaves.API:

1. Install the node dependencies `npm install`
2. Move the example Environment file to `.env` that will be ignored by git and read by the test code `mv example.env .env`
3. Insert credentials into `.env`
* Set BUNDLE in .env equal to the Astra Secure Connect Bundle .zip folder name from astra.credentials

* Set USER and PASS equal to the Astra Credentials associated with the Secure Connect Bundle

```
NODE_ENV=development
PORT=8000
EXAMPLE="example-environmental-variable"
BUNDLE=path/to/zip/in/Astra/Credentials
USER="Example"
PASS="Example"
```
4. Point the API that is being tested at localhost:8000, or change line 3 in /test/app.spec.js to whichever URL the API points to

## Scripts

Run the tests `npm test`
