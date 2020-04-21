const { testRecord1, testRecord2, testRecord3, insertRecord, cleanTable, deleteRecord } = require('./test.helpers');

supertest = supertest('http://localhost:8000');

describe('Endpoints', () => {

  // afterEach('truncate table', () => {

  //   cleanTable();

  // });

  it.only('Create a record via CQL, then retrieve the record', () => {

    insertRecord(testRecord1);

    return supertest
      .get('/api/leaves')
      .expect(200)
      .expect(res => {
        expect(res.body[0].id).to.eql(testRecord.id);
        expect(res.body[0].domain_name).to.eql(testRecord.domain_name);
        expect(res.body[0].title).to.eql(testRecord.title);
      });
      
  });

  it('Create a set of rows in one partition via CQL, then retrieve them and number of rows should be same', () => {

    insertRecord(testRecord1);
    insertRecord(testRecord2);
    insertRecord(testRecord3);

    return supertest
      .get('/api/leaves')
      .expect(res => {
        expect(res.body[0].id).to.eql(testRecord1.id);
        expect(res.body[1].id).to.eql(testRecord2.id);
        expect(res.body[2].id).to.eql(testRecord3.id);
        expect(res.body.length).to.eql(3);
      });
  });

  it('Insert a record via CQL, then delete the record and make sure its gone', () => {    
    
    insertRecord(testRecord1);

    deleteRecord(testRecord1);

    return supertest
      .delete(`/api/leaves/${testRecord1.id}`)
      .expect(200, {
        message: 'deleted'
      });
  });
  
});