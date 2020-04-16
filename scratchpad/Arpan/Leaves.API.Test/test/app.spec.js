const app = require('../src/app');
const cassandra = require('cassandra-driver');
const config = require('../config');

const client = new cassandra.Client({
  cloud: { secureConnectBundle: config.BUNDLE },
  credentials: { username: config.USER, password: config.PASS }
});

client.connect(function(err, result){
  console.log('astra connected');
});

describe('Endpoints', () => {

  afterEach('truncate table', () => {

    let truncateQuery = 'TRUNCATE keyspace.table';

    client.execute(truncateQuery);

  });

  it('Create a record, retrieve the record', () => {

    let testRecord = {
      email: 'testEmail',
      firstname: "testFN",
      lastname: "testLN",
    }

    let query = 'INSERT INTO keyspace.table(userid, created_date, email, firstname, lastname) VALUES (?,?,?,?,?);'; 
    let params = [userid, created_date, email, firstname, lastname]; 
    client.execute(query, params);

    return supertest(app)
      // .post('/api/leaves')
      // .send(testRecord)
      // .expect(201)
      .get('/api/leaves')
      .expect(res => {
        expect(res.KeyValue).to.eql(testRecord.KeyValue);
        expect(res.KeyValue).to.eql(testRecord.KeyValue);
        expect(res.KeyValue).to.eql(testRecord.KeyValue);
      });
  });

  it('Create a set of rows in one partition, retrieve them and number of rows should be same', () => {
    
    // let testRecord1 = {};
    // let testRecord2 = {};
    // let testRecord3 = {}; 

    return supertest(app)
      // .post('/api/leaves')
      // .send(testRecord1, testRecord2, testRecord3)
      // .expect(201)
      .get('/api/leaves')
      .expect(res => {
        expect(res[0]).to.deep.equal(testRecord1);
        expect(res[1]).to.deep.equal(testRecord2);
        expect(res[2]).to.deep.equal(testRecord3);
      });
  });

  it('Delete a record and make sure its gone', () => {
    
    let id = '';

    let deleteQuery = 'DELETE FROM keyspace.table WHERE id=?;';

    let params = [id];

    client.execute(deleteQuery, params);

    return supertest(app)
      // .delete(`api/leaves/${id}`)
      // .expect(204)
      .get(`/api/leaves/${id}`)
      .expect(404);
  });
  
});