//import test records and functions from ./test.helpers that were used to help modularize this file
const { testRecord1, testRecord2, testRecord3, testRecord4, testRecord5, insertRecord, cleanTable, deleteRecord } = require('./test.helpers');

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

    //test request body
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
        //Python and node processors scrape different titles
        //expect(res.body.title).to.eql(testRecord4.title);
        //expect response domain_name to match test record domain_name
        expect(res.body.domain_name).to.eql(testRecord4.domain_name);
      });
  });

  // Fifth Test
  it('Update a record via PATCH, and make sure it was updated', async() => {

    await insertRecord(testRecord4);

    //test request id
    let id = testRecord4.id;

    //test request body with tags, title, and is_starred
    let testRequest = {
      tags: ['did.this.update.correctly'],
      title: 'I am the title now',
      is_starred: 1
    };

    return supertest
    //make a patch request
      .patch(`/api/leaves/${id}`)
    //send request body
      .send(testRequest)
      .expect(201)
      .expect(res => {
        //expect unchanged response id to match the id of the item being updated
        expect(res.body.id).to.eql(id);
        //expect unchanged response url to match test record url
        expect(res.body.url).to.eql(testRecord4.url);
        //expect unchanged response content to match test record conent
        expect(res.body.content).to.eql(testRecord4.content);
        //expect updated response tags to match test request tags
        expect(res.body.tags).to.eql(testRequest.tags);
        //expect updated response title to match test request title
        expect(res.body.title).to.eql(testRequest.title);
        //expect updated response is_starred to match test request is_starred
        expect(res.body.is_starred).to.eql(testRequest.is_starred);
      });
  });

  //Sixth Test
  it('Gets tags of item associated with id via GET', async() => {

    await insertRecord(testRecord4);

    return supertest
      .get(`/api/leaves/${testRecord4.id}/tags`)
      .expect(200)
      .expect(res => {
        expect(res.body).to.eql(testRecord4.tags);
      });

  });

  //Seventh Test
  it('Inserts tags to item associated with id via POST', async() => {

    await insertRecord(testRecord4);

    let testRequest = {
      tags: ['additional tag', 'test tag', 'let make sure this works']
    };

    let tagCheck = {
      tags: [...testRecord4.tags, 'additional.tag', 'test.tag', 'let.make.sure.this.works']
    };

    return supertest
      .post(`/api/leaves/${testRecord4.id}/tags`)
      .send(testRequest)
      .expect(201)
      .expect(res => {
        expect(res.body.id).to.eql(testRecord4.id);
        expect(res.body.tags).to.eql(tagCheck.tags);
        expect(res.body.slugs).to.eql(tagCheck.tags);
      });
  });

  //Eigth Test
  it('Deletes tags of item associated with id via DELETE', async() => {

    await insertRecord(testRecord4);

    return supertest
      .delete(`/api/leaves/${testRecord4.id}/tags`)
      .expect(200)
      .expect(res => {
        expect(res.body.id).to.eql(testRecord4.id);
        expect(res.body.tags).to.eql(null);
        expect(res.body.slugs).to.eql(null);
      });

  });

  
});