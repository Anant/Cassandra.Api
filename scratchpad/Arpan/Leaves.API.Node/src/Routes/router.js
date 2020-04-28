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

      let query = 'SELECT * FROM killrvideo.leaves;';
      client.execute(query, function(err, result){
        // console.log(result)
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

      //will change this at a later time for read/write to leaves
      const {is_archived, is_starred, user_name, user_email, user_id, tags, is_public,
        id, uid, title, url, content, created_at, updated_at, published_at, published_by,
        starred_at, annotations, mimetype, language, reading_time, domain_name, preview_picture,
        http_status, headers, origin_url, _links } 
        = req.body;

      newLeaf = {is_archived, is_starred, user_name, user_email, user_id, tags, is_public,
        id, uid, title, url, content, created_at, updated_at, published_at, published_by,
        starred_at, annotations, mimetype, language, reading_time, domain_name, preview_picture,
        http_status, headers, origin_url, _links };

      for (const [key, value] of Object.entries(newLeaf))
        if (!value)
          return res.status(400).json({
            error: `Missing '${key}' in request body`
          });

      let query = 'INSERT INTO killrvideo.leaves(is_archived, is_starred, user_name, user_email, user_id, tags, is_public, id, uid, title, url, content, created_at, updated_at, published_at, published_by, starred_at, annotations, mimetype, language, reading_time, domain_name, preview_picture, http_status, headers, origin_url, _links) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);'; 

      let params = [is_archived, is_starred, user_name, user_email, user_id, tags, is_public,
        id, uid, title, url, content, created_at, updated_at, published_at, published_by,
        starred_at, annotations, mimetype, language, reading_time, domain_name, preview_picture,
        http_status, headers, origin_url, _links];

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
      // let number = Number(id);
      let query = 'SELECT * FROM killrvideo.leaves WHERE id=?;';
      let params = [id];
      let result = await client.execute(query, params, { prepare : true });
      
      if(result.rows.length === 0){
        return res.status(404).json({
          message: 'Not Found'
        });
      }

      else {
        return res.status(200).json(result.rows[0]);
      }
    }

    catch(e){
      next();
    }
  })

  .patch(jsonParser, async (req, res, next) => {
    try{
      
      //will update once we start implementing read/write stuff with leaves and figuring out what we allow in being updated
      let leafId = req.params.leafId;

      const {is_archived, is_starred, user_name, user_email, user_id, tags, is_public, 
        id, uid, title, url, content, created_at, updated_at, published_at, published_by,
        starred_at, annotations, mimetype, language, reading_time, domain_name, preview_picture,
        http_status, headers, origin_url, _links } 
        = req.body;

      newLeaf = {is_archived, is_starred, user_name, user_email, user_id, tags, is_public,
        id, uid, title, url, content, created_at, updated_at, published_at, published_by,
        starred_at, annotations, mimetype, language, reading_time, domain_name, preview_picture,
        http_status, headers, origin_url, _links };

      for (const [key, value] of Object.entries(newLeaf))
        if (!value)
          return res.status(400).json({
            error: `Missing '${key}' in request body`
          });

      //udpate query depending on what we allow for being updated
      let query = 'UPDATE killrvideo.leaves SET email=?, firstname=?, lastname=? WHERE id=?;';

      //change out params depending on what we allow for being updated
      const params = [is_archived, is_starred, user_name, user_email, user_id, tags, is_public,
        id, uid, title, url, content, created_at, updated_at, published_at, published_by,
        starred_at, annotations, mimetype, language, reading_time, domain_name, preview_picture,
        http_status, headers, origin_url, _links, leafId];

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
        let deleteQuery = 'DELETE FROM killrvideo.leaves WHERE id=?;';
        let params = [id];

        await 
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

  