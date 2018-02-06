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

const userInputValues = ["stresslevel", "tirednesslevel", "activtylevel", "healthinesslevel"];
const watchInputValues = ["activeenergyburned", "deepsleep", "flightsclimbed", "heartrate", "sleep", "sleepheartrate", "stepcounter", "walkingrunningdistance"];

routes.get('/test/:id', async (req, res) => {
    const result = firebase.auth();
    const idToken = req.params.id;
    await admin.admin.auth().verifyIdToken(idToken)
        .then(function (decodedToken) {
            var uid = decodedToken.uid;

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


routes.get("/fitness/querying/correlation", async function (req, res) {
    let data1 = req.query.data1.map(item => {
        return parseInt(item);
    });
    fs.writeFileSync("dataset1.json", data1);

    let data2 = req.query.data2.map(item => {
        return parseInt(item);
    });
    fs.writeFileSync("dataset2.json", data2);
    let result = stats.correlation(data1, data2);
    res.send(result);
});





routes.get("/query1/:userid/:parameter1/:parameter2/:date/", async function (req, res) {
    //:duration


    const userid = req.params.userid;
    const parameter1 = req.params.parameter1;
    const parameter2 = req.params.parameter2;

    const startdate = req.params.date;
    //const duration = req.params.duration.toLowerCase();
    const enddate = moment(new Date(startdate)).subtract(30, 'days').format("YYYY-MM-DD");

    let response;
    //user input / user input query
    if (userInputValues.includes(parameter1) && userInputValues.includes(parameter2)) {
        response = await useruserQuery(parameter1, parameter2, userid, startdate, enddate);
        //console.log(response);

        response.image = await getBase64("http://localhost:8000/correlation", 'post',
            response.data1.rows,
            response.data2.rows,
            parameter1,
            parameter2
        );
        var information = await datasetInformation(response.data1.rows, response.data2.rows)
        console.log(information)
    }

    //watch / watch query
    if (watchInputValues.includes(parameter1) && watchInputValues.includes(parameter2)) {
        response = await watchwatchQuery(parameter1, parameter2, userid, startdate, enddate);

        response.image = await getBase64("http://localhost:8000/correlation", 'post',
            response.data1.rows,
            response.data2.rows,
            parameter1,
            parameter2
        );

        response.stats = await datasetInformation(response.data1.rows, response.data2.rows, parameter1, parameter2)

    }

    //get further information about the datasets

    //console.log(response);
    const data = {
        image: response.image,
        stats: JSON.parse(response.stats.data)
    }
    console.log(data);
    res.send(data);

});

async function datasetInformation(dataset1, dataset2, parameter1, parameter2) {
    return await axios.post("http://localhost:8000/datasetInformation", {
        dataset1,
        dataset2,
        parameter1,
        parameter2
    })
}






async function useruserQuery(parameter1, parameter2, userid, startdate, enddate) {
    const client = new pg.Client(conString);
    await client.connect();
    //collection date 
    let query1 = format("SELECT %I, userid, collectiondate FROM userinput WHERE userid = %L AND collectiondate" +
        "< %L AND collectiondate > %L", parameter1, userid, startdate, enddate);
    let query2 = format("SELECT %I, userid, collectiondate FROM userinput WHERE userid = %L AND collectiondate" +
        "< %L AND collectiondate > %L", parameter2, userid, startdate, enddate);

    let data1 = await client.query(query1);
    let data2 = await client.query(query2);
    data1.rows = objectkeyReplace(data1.rows, 'collectiondate');
    data1.rows = userInputTotalKey(data1.rows, parameter1);

    data2.rows = objectkeyReplace(data2.rows, 'collectiondate');
    data2.rows = userInputTotalKey(data2.rows, parameter2);

    await client.end();

    return {
        data1,
        data2,
        parameter1,
        parameter2
    }

    // return await getBase64("http://localhost:8000/correlation", 'post',
    //     data1.rows,
    //     data2.rows,
    //     parameter1,
    //     parameter2
    // );
}




async function watchwatchQuery(parameter1, parameter2, userid, startdate, enddate) {
    const client = new pg.Client(conString);
    await client.connect();
    let query1;
    let query2;

    const startdateColumn = ['activeenergyburned', 'stepcounter', 'deepsleep', 'sleep', 'sleepheartrate', 'walkingrunningdistance'];
    //const collectiondateColumn = ['flightsclimbed', 'heartrate'];
    if (startdateColumn.includes(parameter1)) {
        query1 = format("SELECT * FROM %I WHERE userid = %L AND startdate " +
            "< %L AND startdate > %L", parameter1, userid, startdate, enddate);
    } else {
        query1 = format("SELECT * FROM %I WHERE userid = %L AND collectiondate" +
            "< %L AND collectiondate > %L", parameter1, userid, startdate, enddate);
    }

    if (startdateColumn.includes(parameter2)) {
        query2 = format("SELECT * FROM %I WHERE userid = %L AND startdate " +
            "< %L AND startdate > %L", parameter2, userid, startdate, enddate);
    } else {
        query2 = format("SELECT * FROM %I WHERE userid = %L AND collectiondate" +
            "< %L AND collectiondate > %L", parameter2, userid, startdate, enddate);
    }


    let data1 = await client.query(query1);
    let data2 = await client.query(query2);

    await client.end();
    if (!Object.keys(data1.rows[0]).includes('startdate')) {
        data1.rows = objectkeyReplace(data1.rows, 'collectiondate', 'startdate');
    }

    if (!Object.keys(data2.rows[0]).includes('startdate')) {
        data2.rows = objectkeyReplace(data2.rows, 'collectiondate', 'startdate');
    }

    data1 = genericFormatForR(data1);
    data2 = genericFormatForR(data2);

    // return await getBase64("http://localhost:8000/correlation", 'post',
    //     genericData1Format.rows,
    //     genericData2Format.rows,
    //     parameter1,
    //     parameter2
    // );

    return {
        data1,
        data2,
        parameter1,
        parameter2
    }
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
            res.send(error.data);
        });
    return value;
}


function genericFormatForR(data) {
    //need to check the data thats does not contain total 
    if (!Object.keys(data.rows[0]).includes('total')) {
        //check the first object as the data SHOULD be the same format throughout the object as the data has been retuend from the database

        //check for possbile keys need to add duplicate data for total key
        if (Object.keys(data.rows[0]).includes('heartrate')) {
            //heart rate 
            for (let i = 0; i < data.rows.length; i++) {
                data.rows[i].total = data.rows[i]['heartrate'];
            }
        }
        if (Object.keys(data.rows[0]).includes('duration')) {
            //sleep and deep sleep
            for (let i = 0; i < data.rows.length; i++) {
                data.rows[i].total = data.rows[i]['duration'];
            }
        }
        if (Object.keys(data.rows[0]).includes('value')) {
            //sleep heart rate 
            for (let i = 0; i < data.rows.length; i++) {
                data.rows[i].total = data.rows[i]['value'];
            }
        }

    }
    return data
}

function userInputTotalKey(obj, moodKey) {
    for (let i = 0; i < obj.length; i++) {
        obj[i].total = obj[i][moodKey];
    }
    return obj;
}

function objectkeyReplace(obj, collectionDate) {
    for (let i = 0; i < obj.length; i++) {
        obj[i].startdate = obj[i][collectionDate];
        obj[i].enddate = obj[i][collectionDate];//R needs a enddate key
    }
    return obj;
}

module.exports = routes;
