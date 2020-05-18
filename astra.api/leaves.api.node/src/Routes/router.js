//This file is used to modularize app.js so that all of the endpoints do not have to exist in app.js. 
//The router (leavesRouter) will be exported to be used in app.js

const express = require('express');
const leavesRouter = express.Router();
const jsonParser = express.json();
const cassandra = require('cassandra-driver');
const config = require('../config');
const { processor } = require('../processor');
// const ExpressCassandra = require('express-cassandra');
//leavesModel that contains the model for the table
// const leavesModel = require('../Models/leavesModel');

// const models = ExpressCassandra.createClient({
//   clientOptions: {
//     cloud: { secureConnectBundle: `../../astra.credentials/secure-connect-${config.ASTRA_CLUSTER}.zip`},
//     credentials: { username: config.ASTRA_USERNAME, password: config.ASTRA_PASSWORD },
//     keyspace: `${config.ASTRA_KEYSPACE}`
//   }
// });

// const MyModel = models.loadSchema('Leaves', leavesModel);

// // MyModel or models.instance.Leaves can now be used as the model instance
// console.log(models.instance.Leaves === MyModel);



// set up connection to Astra using cassandra-driver from DataStax
const client = new cassandra.Client({
  cloud: { secureConnectBundle: `../../astra.credentials/secure-connect-${config.ASTRA_CLUSTER}.zip`},
  credentials: { username: config.ASTRA_USERNAME, password: config.ASTRA_PASSWORD }
});

// dont actually need this to run the node api, but we can keep it for confirmation of connection
// Connecting to Astra database with console.log confirming connection
client.connect(function(err, result){
  console.log('astra connected');
});

//Using express router and the base route of /api/leaves/
leavesRouter
  .route('/')
  //GET request to /api/leaves/ to return all items
  .get( async (req, res, next) => {
    try{

      //query to make to Astra 
      let query = `SELECT * FROM ${config.ASTRA_KEYSPACE}.${config.ASTRA_TABLE};`;

      //await client executing the query and set the results into a variable
      let result = await client.execute(query);

      //return the result of the query in JSON format
      return res.status(200).json(result.rows);


      // express-cassandra find one
      // models.instance.Leaves.findOne({id: 13952}, function(err, result){
      //   if(err){
      //     console.log(err);
      //     return;
      //   }

      //   console.log(result);
      // })

    }

    catch(e){
      res.status(400).json({
        message: e.message
      });
      next();
    }
  })

  //Currently under construction and subject to change
  .post(jsonParser, async (req, res, next) => {
    try{

      //object destructuring of request body  
      const { tags, url } 
        = req.body;

      //validate for missing keys in request body
      for (const [key, value] of Object.entries(req.body))
        if (!value)
          return res.status(400).json({
            error: `Missing '${key}' in request body`
          });

      //creating new object to insert into Astra
      newLeaf = { tags, url };

      //run processor on newLeaf to generate other key values
      await processor(newLeaf);
      
      //initialize an empty array for all key value pair in newLeaf
      let all = [];

      //run for loop through newLeaf to get all values into newLeaf.all
      for(let key in newLeaf){
        //check if newLeaf[key] value is an array
        if( Array.isArray(newLeaf[key]) ){
          //if newLeaf[key] is an array, iterate through the array and push them individually
          for(let i = 0; i < newLeaf[key].length; i++){
            all.push(newLeaf[key][i]);
          }
        }
        
        //else push in newLeaf[key] into all array
        else{
          all.push(newLeaf[key].toString());
        }

      }

      //set newLeaf all key to equal the array all populated from the for loop
      newLeaf.all = all;

      //query to insert into Astra
      let query = `INSERT INTO ${config.ASTRA_KEYSPACE}.${config.ASTRA_TABLE} JSON ?;`; 

      //execute query to Astra and store result in variable
      await client.execute(query, [JSON.stringify(newLeaf)], { prepare : true });

      //send back the result to the client
      return res.status(201).json(newLeaf);

    }
    catch(e){
      res.status(400).json({
        message: e.message
      });
      next();
    }
  });


//Using express router and the route of /api/leaves/:id
leavesRouter
  .route('/:id')
  
  //GET request to /api/leaves/:id
  .get( async (req, res, next) => {
    try{
      //take id from request params
      let id = req.params.id;
      //query to make to Astra using the id obtained
      let query = `SELECT * FROM ${config.ASTRA_KEYSPACE}.${config.ASTRA_TABLE} WHERE id=?;`;
      //preparing the params
      let params = [id];
      //execute the query to Astra
      let result = await client.execute(query, params, { prepare : true });
      
      //validation if the item is not found
      if(result.rows.length === 0){
        return res.status(404).json({
          message: 'Not Found'
        });
      }

      //return the item in JSON format
      else {
        return res.status(200).json(result.rows[0]);
      }
    }

    catch(e){
      res.status(400).json({
        message: e.message
      });
      next();
    }
  })

  // Currently under construction and subject to change
  .patch(jsonParser, async (req, res, next) => {
    try{
      
      //extract id from params
      let leafId = req.params.leafId;

      //object destructuring request body
      const { is_archived, is_starred, user_name, user_email, user_id, tags, is_public, 
        id, uid, title, url, content, created_at, updated_at, published_at, published_by,
        starred_at, annotations, mimetype, language, reading_time, domain_name, preview_picture,
        http_status, headers, origin_url, _links } 
        = req.body;

      //creating new object to insert into Astra
      newLeaf = { is_archived, is_starred, user_name, user_email, user_id, tags, is_public,
        id, uid, title, url, content, created_at, updated_at, published_at, published_by,
        starred_at, annotations, mimetype, language, reading_time, domain_name, preview_picture,
        http_status, headers, origin_url, _links };

      //validate for missing keys in request body
      for (const [key, value] of Object.entries(newLeaf))
        if (!value)
          return res.status(400).json({
            error: `Missing '${key}' in request body`
          });

      //udpate query depending on what we allow for being updated
      let query = `INSERT INTO ${config.ASTRA_KEYSPACE}.${config.ASTRA_TABLE} JSON ? DEFAULT UNSET;`; 

      //execute query to Astra and store result in variable
      let result = await client.execute(query, [JSON.stringify(newLeaf)], { prepare : true });

      //send back the result to the client
      return res.status(201).json(result);
    }
    catch(e){
      res.status(400).json({
        message: e.message
      });
      next();
    }
  })

  //DELETE request to /api/leaves/:id
  .delete( async (req, res, next) => {
    try{
      //take id from request params
      let id = req.params.id;

      //first check if the item exists
      let searchQuery = `SELECT * FROM ${config.ASTRA_KEYSPACE}.${config.ASTRA_TABLE} where id=?;`;
      //prepare the params
      let params = [id];
      //check if the item exists
      let checkIfExists = await client.execute(searchQuery, params, {prepare : true});

      //validation if the item does not exist
      if (checkIfExists.rows.length === 0){
        return res.status(404).json({
          message: 'This item does not exist'
        });
      }

      //run if the item to be deleted does exist
      else{
        //delete query to make on Astra using the prepared params from above
        let deleteQuery = `DELETE FROM ${config.ASTRA_KEYSPACE}.${config.ASTRA_TABLE} WHERE id=?;`;
 
        //execute the query
        client.execute(deleteQuery, params, { prepare : true }, function(err){
          if(!!err){
            return res.status(400).json({
              error: 'Error deleting data'
            });
          }
          else{
            return res.status(200).json({
              message: 'deleted'
            });
          }
        });
      }
    }
    
    catch(e){
      res.status(400).json({
        message: e.message
      });
      next();
    }
  });  



module.exports = leavesRouter;

  