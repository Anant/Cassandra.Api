# Leaves.API.Test

Test Connectivity locally & [Gitpod](https://gitpod.io/)


## Getting Started

leaves.astra/astra.api/leaves.api.tests

```sh
npm install 
npm run test
```

### Tests

* Create a record via CQL, then retrieve the record
* Create a set of rows in one partition via CQL, then retrieve them and number of rows should be same
* Insert a record via CQL, then delete the record via CQL and make sure its gone
  
### Tech Stack
- [Mocha](https://mochajs.org/)
- [Chai](https://www.chaijs.com/api/bdd/)
- [supertest](https://github.com/visionmedia/supertest)
  
#### Troubleshooting

* Point the API that is being tested to port `8000`, or change line 3 in *leaves.api.tests/test/app.spec.js* to match the running URL/PORT of the API.
* **Ensure your Node/Python API is running before starting tests**