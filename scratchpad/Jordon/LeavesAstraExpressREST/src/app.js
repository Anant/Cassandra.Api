require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const cassandra = require('cassandra-driver')

let client = new cassandra.Client({contactPoints: ['127.0.0.1'], localDataCenter: 'datacenter1'});
client.connect(function(err, result){
    console.log('index: cassandra connected');
});

let getAllCassandraArticles = 'SELECT * FROM leaves.cassandra'

const app = express()

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(cors())
app.use(morgan(morganOption))
app.use(helmet())
app.get('/', (req, res) => {
    client.execute(getAllCassandraArticles, [], function(err, result){
        if(err){
            res.status(404).send({msg: err});
        }else{
            console.log(result)
            res.send(result.rows)
        }
    });
})


app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app