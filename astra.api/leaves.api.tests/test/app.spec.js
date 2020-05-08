//import test records and functions from ./test.helpers that were used to help modularize this file
const { testRecord1, testRecord2, testRecord3, insertRecord, cleanTable, deleteRecord } = require('./test.helpers');

//set supertest to listen at 'http://localhost:8000'
supertest = supertest('http://localhost:8000');

//Test suite for testing the node and python api's
describe('Endpoints', () => {

  //before each test, truncate the table
  beforeEach('truncate table', async() => {

    //await the truncate the happen
    await cleanTable();
 
  });

  //after each test, truncate the table
  afterEach('truncate table', async() => {

    //await the truncate to happen
    await cleanTable();

  });

  //First test
  it('Create a record via CQL, then retrieve the record', async() => {

    //await test record 1 to be inserted into Astra
    await insertRecord(testRecord1);

    return supertest
      //make a GET request
      .get('/api/leaves')
      //expect a response status of 200
      .expect(200)
      //expect the response values to match the test record values that were sent with the insert function
      .expect(res => {
        expect(res.body[0].id).to.eql(testRecord1.id);
        expect(res.body[0].domain_name).to.eql(testRecord1.domain_name);
        expect(res.body[0].title).to.eql(testRecord1.title);
      });
      
  });

  //Second test
  it('Create a set of rows in one partition via CQL, then retrieve them and number of rows should be same', async() => {

    //await the 3 test records to be added to Astra
    await insertRecord(testRecord1);
    await insertRecord(testRecord2);
    await insertRecord(testRecord3);

    return supertest
      //make a GET request
      .get('/api/leaves')
      //expect the response values to match the test records' values that were sent with the insert functions
      .expect(res => {
        expect(res.body[0].id).to.eql(testRecord1.id);
        expect(res.body[1].id).to.eql(testRecord2.id);
        expect(res.body[2].id).to.eql(testRecord3.id);
        //expect the response body length (array) to be equal to 3 as 3 items were inserted
        expect(res.body.length).to.eql(3);
      });
  });

  //Third test
  it('Insert a record via CQL, then delete the record via CQL and make sure its gone', async() => {    
    
    //await inserting a test record to Astra
    await insertRecord(testRecord1);

    //await deleted the inserted test record
    await deleteRecord(testRecord1);

    return supertest
      //make a GET request
      .get(`/api/leaves/${testRecord1.id}`)
      //expect status code of 404 as it will not be found
      .expect(404);
  });
  
});