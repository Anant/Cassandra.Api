//This file is used to modularize app.js so that all of the endpoints do not have to exist in app.js. 
//The router (leavesRouter) will be exported to be used in app.js

const express = require('express');
const leavesRouter = express.Router();
const jsonParser = express.json();
const cassandra = require('cassandra-driver');
const config = require('../config');
const { processor } = require('../processor');


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
      const { url } 
        = req.body;

      //validate for missing keys in request body
      for (const [key, value] of Object.entries(req.body))
        if (!value)
          return res.status(400).json({
            error: `Missing '${key}' in request body`
          });

      //creating new object to insert into Astra
      newLeaf = { url };

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

  //allow title, tags, is_archived, is_starred, content, language, preview_picture, is_public, and url to be updated
  .patch( jsonParser, async (req, res, next) => {
    try{
      //extract id from params
      let id = req.params.id;
      //find query to check if the url is different
      let findQuery = `SELECT * FROM ${config.ASTRA_KEYSPACE}.${config.ASTRA_TABLE} WHERE id=?;`;
      //prepare params
      let params = [id];
      //execute find query
      let findResult = await client.execute(findQuery, params, { prepare: true });
      //check if there is a new url in the params
      if(!!req.body.url && findResult.rows[0].url !== req.body.url){
        //if so, instantiate a newLeaf object
        let newLeaf = {};
        //set newLeaf.url to the url in the params
        newLeaf.url = req.body.url;
        //run processor to generate other key values
        await processor(newLeaf);
        //if req.body has tags
        if(!!req.body.tags){
          //parse tags to remove spaces and replace with periods
          for(i = 0; i < req.body.tags.length; i++){
            req.body.tags[i] = req.body.tags[i].replace(/\s/g, '.');
          }
        }
        //newLeaf.tags = req.body.tags
        newLeaf.tags = req.body.tags;
        //newLeaf.slugs = newLeaf.tags
        newLeaf.slugs = newLeaf.tags;
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
        //set newLeaf.all equal to all array
        newLeaf.all = all;
        //udpate query depending on what we allow for being updated
        let updateQuery = `INSERT INTO ${config.ASTRA_KEYSPACE}.${config.ASTRA_TABLE} JSON ? DEFAULT UNSET;`; 
        //execute query to Astra and store result in variable
        await client.execute(updateQuery, [JSON.stringify(newLeaf)], { prepare : true });
        //send query to send back the updated row
        let sendQuery = `SELECT * FROM ${config.ASTRA_KEYSPACE}.${config.ASTRA_TABLE} WHERE id=?;`;
        //prepare params
        let sendParams = [newLeaf.id];
        //execute find query
        let updatedRow = await client.execute(sendQuery, sendParams, { prepare: true });

        //send back the result to the client
        return res.status(201).json(updatedRow.rows[0]);
      }
      else{
        //check if tags in request body
        if(!!req.body.tags){
          //parse tags to remove spaces and replace with periods
          for(i = 0; i < req.body.tags.length; i++){
            req.body.tags[i] = req.body.tags[i].replace(/\s/g, '.');
          }
        }
        //set newLeaf equal to req.body object
        let newLeaf = req.body;
        //set newLeaf.id to id from params
        newLeaf.id = id;
        //set updated at time to now
        newLeaf.updated_at = Date.now();
        //set newLeaf.all equal to the initial found result.all
        newLeaf.all = [...findResult.rows[0].all];
        //add tags and slugs arrays into newLeaf.all
        for (let i = 0; i < req.body.tags.length; i++ ){
          if (newLeaf.all.includes( req.body.tags[i]) === false){
          //add once for newLeaf.tags
            newLeaf.all.push(req.body.tags[i]);
            //add again for newLeaf.slugs since newLeaf.slugs = newLeaf.tags
            newLeaf.all.push(req.body.tags[i]);
          }
        }
        //udpate query depending on what we allow for being updated
        let updateQuery = `INSERT INTO ${config.ASTRA_KEYSPACE}.${config.ASTRA_TABLE} JSON ? DEFAULT UNSET;`; 
        //execute query to Astra and store result in variable
        await client.execute(updateQuery, [JSON.stringify(newLeaf)], { prepare : true });
        //send query to send back the updated row
        let sendQuery = `SELECT * FROM ${config.ASTRA_KEYSPACE}.${config.ASTRA_TABLE} WHERE id=?;`;
        //prepare params
        let sendParams = [newLeaf.id];
        //execute find query
        let updatedRow = await client.execute(sendQuery, sendParams, { prepare: true });
        //send back the result to the client
        return res.status(201).json(updatedRow.rows[0]);
      }
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

//using Express router and route of /api/leaves/:id/tags
leavesRouter
  .route('/:id/tags')
  //get tags associated with item id
  .get(async(req, res, next ) => {

    try{
      //extract id from params
      let id = req.params.id;

      //query to get tags from item
      let query = `SELECT tags FROM ${config.ASTRA_KEYSPACE}.${config.ASTRA_TABLE} WHERE id=?;`;
  
      //prepare params
      let params = [id];
  
      //execute query on Astra and store result in variable
      let result = await client.execute(query, params, {prepare: true});
  
      //send tags array back
      return res.status(200).json(result.rows[0].tags);
    }

    catch(e){
      res.status(400).json({
        message: e.message
      });
      next();
    }

  })

  //add tags to item with associated id
  .post(jsonParser, async(req, res, next) => {
    try{

      //extract id from params
      let id = req.params.id;

      //destructure tags from request body
      const { tags } = req.body;

      //parse tags to remove spaces and replace with periods
      for(i = 0; i < tags.length; i++){
        tags[i] = tags[i].replace(/\s/g, '.');
      }

      //Get item associated with id because we have to add to key values of all and slugs
      //query to make to Astra using the id obtained
      let findQuery = `SELECT * FROM ${config.ASTRA_KEYSPACE}.${config.ASTRA_TABLE} WHERE id=?;`;
      //preparing the params
      let params = [id];
      //execute the query to Astra
      let result = await client.execute(findQuery, params, { prepare : true });
      //set newLeaf equal to item associated with id from params
      let newLeaf = result.rows[0];
      //set newLeaf.tags equal to tags from request body
      if(newLeaf.tags === null){
        newLeaf.tags = tags;
      }
      else{
        newLeaf.tags = [...newLeaf.tags, ...tags];
      }
      //remove duplicates
      let uniqueSet = new Set(newLeaf.tags);
      //turn back into array
      newLeaf.tags = [...uniqueSet];
      //set newLeaf.slugs equal to tags
      newLeaf.slugs = newLeaf.tags;
      //add tags and slugs arrays into all array
      for (let i = 0; i < tags.length; i++ ){
        if (newLeaf.all.includes(tags[i]) === false){
          //add once for newLeaf.tags
          newLeaf.all.push(tags[i]);
          //add again for newLeaf.slugs since newLeaf.slugs = newLeaf.tags
          newLeaf.all.push(tags[i]);
        }
      };

      //insert query for tags into existing item with associated id
      let insertQuery = `INSERT INTO ${config.ASTRA_KEYSPACE}.${config.ASTRA_TABLE} JSON ? DEFAULT UNSET;`; 

      //execute query to Astra to add tags, slugs, and update all
      await client.execute(insertQuery, [JSON.stringify(newLeaf)], { prepare : true });

      // send back the newLeaf to the client
      return res.status(201).json(newLeaf);

    }

    catch(e){
      res.status(400).json({
        message: e.message
      });
      next();
    }
  })

  .delete(async(req, res, next) => {
    try{

      //extract id from params
      let id = req.params.id;

      //Get item associated with id because we have to add to key values of all and slugs
      //query to make to Astra using the id obtained
      let findQuery = `SELECT * FROM ${config.ASTRA_KEYSPACE}.${config.ASTRA_TABLE} WHERE id=?;`;
      //preparing the params
      let params = [id];
      //execute the query to Astra
      let result = await client.execute(findQuery, params, { prepare : true });
      //set newLeaf equal to item associated with id from params
      let newLeaf = result.rows[0];

      //check if tags exist
      if(newLeaf.tags === null){
        return res.status(400).json({
          'message': 'No tags available to be deleted'
        });
      }

      //filter out tags and slugs from all
      newLeaf.all = newLeaf.all.filter(item => !newLeaf.tags.includes(item));
      //set tags and slugs to empty arrays
      newLeaf.tags = [];
      newLeaf.slugs = [];
      newLeaf.id = id;

      //query to delete tags
      let deleteQuery = `INSERT INTO ${config.ASTRA_KEYSPACE}.${config.ASTRA_TABLE} JSON ? DEFAULT UNSET;`;

      // execute query to Astra and delete tags
      await client.execute(deleteQuery, [JSON.stringify(newLeaf)], { prepare : true });

      return res.status(200).json(newLeaf);
    }

    catch(e){
      res.status(400).json({
        message: e.message
      });
      next();
    }
  });




module.exports = leavesRouter;

  