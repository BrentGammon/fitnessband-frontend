const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
//https://stackoverflow.com/questions/9205496/how-to-make-connection-to-postgres-via-node-js
const pg = require("pg");
const conString = "postgres://postgre:password@localhost:5432/fitnessInfo";
const format = require("pg-format");
const moment = require("moment");
const _ = require("lodash");
const morgan = require('morgan');
const api = require('./routes/api');
const firebase = require('firebase');

const app = express();
app.disable('view cache');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.json({ limit: "100mb" }));

app.use(
    bodyParser.urlencoded({
        limit: "50mb",
        extended: true,
        parameterLimit: 100000000
    })
);
app.use(bodyParser.json({ type: "application/*+json" }));

const app_fire = firebase.initializeApp({
    apiKey: "AIzaSyB7X6pOPyEnb7yFS8FuE4CdzqFSiEe7Ec4",
    authDomain: "reactdemo-b1425.firebaseapp.com",
    databaseURL: "https://reactdemo-b1425.firebaseio.com/",
})


// adding the api routes to express
app.use('/api', api);

// disaling cors for lcoal development 
app.use(cors());

// logging
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', './client/build')));

// if not using api endpoint default will server the static react app 
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', './client/build', 'index.html'));
});


module.exports = app;