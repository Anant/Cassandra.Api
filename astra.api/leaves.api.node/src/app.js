require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const leavesRouter = require('./Routes/router');

//instantiating the express app
const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

//using the imported leavesRouter from /Routes/router.js, we run the functionallity of the requests and endpoints in routes.js with the base route of /api/leaves
app.use('/api/leaves', leavesRouter);

app.use(function errorHandler(error, req, res, next){
  let response;
  if (NODE_ENV === 'production'){
    response = {error: {message: 'server error'}};
  }
  else{
    console.log(error);
    response = {message: error.message, error};
  }

  res.status(500).json(response);
});

//app is then exported to use in server.js
module.exports = app;