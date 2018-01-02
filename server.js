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
const get = require("./api/routes/get");
const post = require("./api/routes/post");

const app = express();
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

app.use(get); //get end points
app.use(post);

app.use(cors());

app.get("/", function(req, res) {
  console.log("hello world");
  res.send("Hello World!");
});

app.listen(3005, function() {
  console.log("Example app listening on port 3005!");
});
