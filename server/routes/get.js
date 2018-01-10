const routes = require("express").Router();
const express = require("express");
const pg = require("pg");
const conString = "postgres://postgres:password@localhost:5432/fitnessInfo";
const format = require("pg-format");
const moment = require("moment");
moment.locale("en-gb");
const cors = require("cors");
const stats = require("../../utilties/statistical/statistical");
const axios = require("axios");
const app = express();
app.disable('view cache');
routes.use(cors());

routes.get('/test', (req, res) => {
  res.send('get api worked!');
});

// routes.get("/test", async function(req, res) {
//   const client = new pg.Client(conString);
//   await client.connect();
//   const data = await client.query("SELECT * FROM userid");
//   await client.end();
//   //console.log(data.rows[0]);
//   res.send(data.rows[0]);
// });

//end point
// routes.get("", async function(req, res) {
//   await client.connect();
//   const data = await client.query("SELECT * FROM userid");
//   await client.end();
// });

routes.get("/user/lastSync/:userid", async function (req, res) {
  const client = new pg.Client(conString);
  await client.connect();
  const userid = req.params.userid;
  const query = format("SELECT lastSync FROM userid WHERE userid = %L", userid);
  const data = await client.query(query);
  await client.end();
  res.send(data.rows);
});

routes.get("/user/:userid", async function (req, res) {
  const client = new pg.Client(conString);
  await client.connect();
  const userId = req.params.userid;
  const values = [userId];
  const query = format("SELECT userId FROM userid WHERE userid = %L", userId);
  const data = await client.query(query);
  await client.end();
  const response = data.rows;
  res.send(response.length == 0 ? false : true);
});

//todo
//rework
//
routes.get("/fitness/querying/correlation", async function (req, res) {
  console.log("correcltion thingy")
  let data1 = req.query.data1.map(item => {
    return parseInt(item);
  });
  let data2 = req.query.data2.map(item => {
    return parseInt(item);
  });
  let result = stats.correlation(data1, data2);
  console.log(result);
  res.send(result);
});

routes.get("/demoChart", async function (req, res) {
  res.send(await getBase64("http://localhost:8000/plot"));
});

//https://stackoverflow.com/questions/41846669/download-an-image-using-axios-and-convert-it-to-base64
async function getBase64(url) {
  let value = null;
  return await axios
    .get(url, {
      responseType: "arraybuffer"
    })
    .then(
    response =>
      (value = new Buffer(response.data, "binary").toString("base64"))
    );
  return value;
}

module.exports = routes;
