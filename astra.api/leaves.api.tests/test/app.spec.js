//import test records and functions from ./test.helpers that were used to help modularize this file
const { testRecord1, testRecord2, testRecord3, testRecord4, insertRecord, cleanTable, deleteRecord } = require('./test.helpers');

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

  //Fourth Test
  it('Insert a record via POST, then make sure it was added', () => {
    
    // this.timeout(15000);

    const testRequest = {
      url:  'https://github.com/Anant/cassandra.api'
    };

    return supertest
      //make a post request
      .post('/api/leaves')
      //send the url
      .send(testRequest)
      //expect a 201
      .expect(201)
      .expect(res => {
        //expect response url to match the url sent
        expect(res.body.url).to.eql(testRequest.url);
        //expect response url to match test record url
        expect(res.body.url).to.eql(testRecord4.url);
        //expect response id to match test record id
        expect(res.body.id).to.eql(testRecord4.id);
        //expect response title to match test record title
        expect(res.body.title).to.eql(testRecord4.title);
        //expect response domain_name to match test record domain_name
        expect(res.body.domain_name).to.eql(testRecord4.domain_name);
      });

  });
  
});