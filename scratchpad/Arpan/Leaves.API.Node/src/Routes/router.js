const express = require('express');
const leavesRouter = express.Router();
const jsonParser = express.json();
const cassandra = require('cassandra-driver');
const config = require('../config');
const {v4: uuidv4} = require('uuid');

const client = new cassandra.Client({
  cloud: { secureConnectBundle: config.BUNDLE },
  credentials: { username: config.USER, password: config.PASS }
});

client.connect(function(err, result){
  console.log('astra connected');
});

leavesRouter
  .route('/')
  .get( async (req, res, next) => {
    try{

      let query = 'SELECT * FROM killrvideo.users;';
      client.execute(query, function(err, result){
        console.log(result)
        return res.status(200).json(result.rows);
      });
      // below is according to the basic usage on driver docs
      //.then(result => res.status(200).json(result.rows));
    }
    catch(e){
      next();
    }
  })

  .post(jsonParser, async (req, res, next) => {
    try{
      const {email, firstname, lastname} = req.body;

      newLeaf = {email, firstname, lastname};

      for (const [key, value] of Object.entries(newLeaf))
        if (!value)
          return res.status(400).json({
            error: `Missing '${key}' in request body`
          });

      let userid = uuidv4();
      let created_date = Date.now();
      let query = 'INSERT INTO killrvideo.users(userid, created_date, email, firstname, lastname) VALUES (?,?,?,?,?);'; 
      let params = [userid, created_date, email, firstname, lastname]; 
      client.execute(query, params, function(err, result){
        if(err){
        //   console.log(err);
          return res.status(400).json({
            error: 'error adding'
          });
        }
        else{
          console.log(result);
          return res.status(201).json({
            message: 'created'
          });
        }
      });
    }
    catch(e){
      next();
    }
  });


leavesRouter
  .route('/:id')
  .get( async (req, res, next) => {
    try{
      let id = req.params.id;
      let query = 'SELECT * FROM killrvideo.users WHERE userid=?;';
      let params = [id];
      client.execute(query, params, function(err, result){
        if(!!result){
          return res.status(200).json(result.rows[0]);
        }
        else{
          return res.status(404).json({
            error: 'Not Found'
          });
        }
      });
    }
    catch(e){
      next();
    }
  })

  .patch(jsonParser, async (req, res, next) => {
    try{
      let id = req.params.id;
      const {email, firstname, lastname} = req.body;

      newLeaf = {email, firstname, lastname};

      for (const [key, value] of Object.entries(newLeaf))
        if (!value)
          return res.status(400).json({
            error: `Missing '${key}' in request body`
          });

      let query = 'UPDATE killrvideo.users SET email=?, firstname=?, lastname=? WHERE userid=?;';
      const params = [email, firstname, lastname, id];
      client.execute(query, params, function(err, result){
        if(err){
        //   console.log(err);
          res.status(400).json({
            error: 'error updating'
          });
        }
        else{
          console.log(result);
          res.status(200).json({
            message: 'updated',
          });
        }
      });
    }
    catch(e){
      next();
    }
  })

  .delete( async (req, res, next) => {
    try{
      let id = req.params.id;
      if(!!id){
        let deleteQuery = 'DELETE FROM killrvideo.users WHERE userid=?;';
        let params = [id];

        await 
        client.execute(deleteQuery, params, function(err){
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
      else{
        return res.status(400).json({
          error: 'id required'
        });
      }

    }
    catch(e){
      next();
    }
  });  



module.exports = leavesRouter;

  