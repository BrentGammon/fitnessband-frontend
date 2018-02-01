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
const fs = require('fs');

//const base = require("../../client/src/base");
const firebase = require("firebase");


// const app_fire = firebase.initializeApp({
//   apiKey: "AIzaSyB7X6pOPyEnb7yFS8FuE4CdzqFSiEe7Ec4",
//   authDomain: "reactdemo-b1425.firebaseapp.com",
//   databaseURL: "https://reactdemo-b1425.firebaseio.com/",
// })


// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://reactdemo-b1425.firebaseio.com"
// });

const admin = require('../firebaseconfig/firebaseAdmin');


routes.get('/test/:id', async (req, res) => {
    const result = firebase.auth();
    const idToken = req.params.id;
    //console.log(admin.auth().verifyIdToken(req.params.id, true));
    await admin.admin.auth().verifyIdToken(idToken)
        .then(function (decodedToken) {
            var uid = decodedToken.uid;
            console.log("++++++++++++++++++++++++++++++++++++++")
            console.log(uid);
            res.send('get api worked!');
            console.log("++++++++++++++++++++++++++++++++++++++")
        }).catch(function (error) {
            res.status(401).send("Unauthorized");
        });
});


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
    fs.writeFileSync("dataset1.json", data1);

    let data2 = req.query.data2.map(item => {
        return parseInt(item);
    });
    fs.writeFileSync("dataset2.json", data2);
    let result = stats.correlation(data1, data2);
    console.log(result);
    res.send(result);
});

routes.get("/demoChart", async function (req, res) {
    res.send(await getBase64("http://localhost:8000/plot", 'get'));
});

routes.get("/query1/:userid/:parameter1/:parameter2/:date/:duration", async function (req, res) {
    const client = new pg.Client(conString);
    await client.connect();

    const userid = req.params.userid;
    const parameter1 = req.params.parameter1;
    const parameter2 = req.params.parameter2;
    const startdate = req.params.date;
    const duration = req.params.duration.toLowerCase();
    let enddate;

    let query1;
    let query2;


    if (duration === "month") {
        enddate = moment(new Date(startdate)).subtract(30, 'days').format("YYYY-MM-DD");
        console.log("monthy")
    } else if (duration === "week") {
        console.log("weeky")
        enddate = moment(new Date(startdate)).subtract(7, 'days').format("YYYY-MM-DD");
    } else if (duration === "day ") {
        console.log("day")
        enddate = moment(new Date(startdate)).subtract(1, 'days').format("YYYY-MM-DD");
    }

    const startdateColumn = ['activeenergyburned', 'stepcounter', 'deepSleep', 'sleep', 'sleepheartrate', 'walkingrunningdistance'];
    //const collectiondateColumn = ['flightsclimbed', 'heartrate'];

    if (startdateColumn.includes(parameter1)) {
        query1 = format("SELECT * FROM %I WHERE userid = %L AND startdate " +
            "< %L AND startdate > %L", parameter1, userid, startdate, enddate);
        console.log('')
        console.log(query1);
    } else {
        query1 = format("SELECT * FROM %I WHERE userid = %L AND collectiondate" +
            "< %L AND collectiondate > %L", parameter1, userid, startdate, enddate);
        console.log(query1);
    }

    if (startdateColumn.includes(parameter2)) {
        query2 = format("SELECT * FROM %I WHERE userid = %L AND startdate " +
            "< %L AND startdate > %L", parameter1, userid, startdate, enddate);
        console.log('')
        console.log(query2);
    } else {
        query2 = format("SELECT * FROM %I WHERE userid = %L AND collectiondate" +
            "< %L AND collectiondate > %L", parameter1, userid, startdate, enddate);
        console.log(query2);
    }


    const data1 = await client.query(query1);
    const data2 = await client.query(query2);

    await client.end();

    const data1Filtered = objectReplace(data1.rows, 'collectiondate', 'startdate');
    const data2Filtered = objectReplace(data2.rows, 'collectiondate', 'startdate');


    res.send(await getBase64("http://localhost:8000/correlation", 'post',
        data1Filtered,
        data2Filtered,
        parameter1,
        parameter2
    ));
});


function objectkeyReplace(obj, keyToBeReplace, keyReplacedWith) {
    var i;
    for (i = 0; i < array.length; i++) {
        obj[i].startdate = obj[i].keyToBeReplace;
        delete obj[i].keyToBeReplace;
    }
    return array;
}


//https://stackoverflow.com/questions/41846669/download-an-image-using-axios-and-convert-it-to-base64
async function getBase64(url, httpMethod, data1, data2, parameter1, parameter2) {
    let value = null;
    let data = {};
    if (data !== null) {
        if (httpMethod === 'get') {
            params: {
                data
            }
        }

        if (httpMethod === 'post') {
            data = {
                dataset1: data1,
                dataset2: data2,
                parameter1: parameter1,
                parameter2: parameter2
            }
        }
    }
    return await axios({
        method: httpMethod,
        url,
        data,
        responseType: "arraybuffer"
    }).then(
        response =>
            (value = new Buffer(response.data, "binary").toString("base64"))
        ).catch(error => {
            console.log("Error");
            // console.log(error);
            res.send(error.data);
        });
    return value;
}


//async function querydb(parameter, userid, startdate, enddate){
//    const client = new pg.Client(conString);
//    await client.connect();
//
//    if(parameter === "activeenergyburned" || "stepcounter" || "deepSleep" || "sleep" || "sleepheartrate"){
//        const query1 = format("SELECT * FROM %I WHERE userid = %L AND startdate " +
//        "< %L AND startdate > %L", parameter, userid, startdate, enddate);
//    }else if(parameter === "flightsclimbed" || "heartrate"){
//        const query1 = format("SELECT * FROM %I WHERE userid = %L AND collectiondate" +
//        "< %L AND collectiondate > %L", parameter, userid, startdate, enddate);
//    }
//
//    const data1 = await client.query(query1);
//
//    await client.end();
//}


module.exports = routes;

