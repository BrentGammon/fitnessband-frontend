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

routes.get("/query1/:userid/:parameter1/:parameter2/:date/:duration", async function (req, res) {
    const client = new pg.Client(conString);
    await client.connect();

    const userid = req.params.userid;
    const parameter1 = req.params.parameter1;
    const parameter2 = req.params.parameter2;
    const startdate = req.params.date;
    const duration = req.params.duration;
    let enddate;

    switch (duration) {
        case "Week":
            enddate = moment(new Date(startdate) - 7).format("YYYY-MM-DD");
            console.log(enddate);
            break;
        case "Month":
            enddate = moment(new Date(startdate) - 30).format("YYYY-MM-DD");
            break;
        case "Day":
            enddate = moment(new Date(startdate) - 1).format("YYYY-MM-DD");
    }

    const query1 = format("SELECT * FROM %I WHERE userid = %L AND startdate " +
        "< %L AND startdate > %L", parameter1, userid, startdate, enddate);

    const query2 = format("SELECT * FROM %I WHERE userid = %L AND startdate " +
        "< %L AND startdate > %L", parameter2, userid, startdate, enddate);

    const data1 = await client.query(query1);
    const data2 = await client.query(query2);
    await client.end();
    console.log(data1.rows[0]);
    axios.post('http://localhost:8000/correlation', {
        dataset1: data1.rows,
        dataset2: data2.rows
    }).then(response => {
        console.log("Response");
        //console.log(response);
        res.send(response.data);
    }).catch(error => {
        console.log("Error");
       // console.log(error);
        res.send(error.data);
    });

    const response1 = data1.rows;
    const response2 = data2.rows;

    //res.send(r);
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
