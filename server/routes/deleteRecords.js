const routes = require("express").Router();
const express = require("express");
const pg = require("pg");
const conString = "postgres://postgres:password@localhost:5432/fitnessInfo";
const format = require("pg-format");
const moment = require("moment");
moment.locale("en-gb");
const cors = require("cors");
const axios = require("axios");
const app = express();
app.disable('view cache');
routes.use(cors());
const fs = require('fs');
const firebase = require("firebase");
const admin = require('../firebaseconfig/firebaseAdmin');



routes.get("/delete/:userid/", async (req, res) => {
    const userid = req.params.userid;
    let response;
    console.log(userid);

    response = await deleteData(userid);

    //const data = {}

    res.send(response);
});

routes.get("/delete/test/", async (req, res) => {
    res.send("hello world");
});

async function deleteData(userid, presentTime, enddate) {
    const client = new pg.Client(conString);
    await client.connect();
    let activeenergyburnedquery1;
    let deepsleepquery2;
    let flightsclimbedquery3;
    let heartratequery4;
    let sleepquery5;
    let sleepheartratequery6;
    let stepcounterquery7;
    let walkingrunningdistancequery8;
    let userinput9;
    let data1;
    let data2;
    let data3;
    let data4;
    let daat5;
    let data6;
    let data7;
    let data8;
    let data9;
    
    try{
        data1 = await client.query(format("DELETE FROM activeenergyburned WHERE userid = %L", userid));

        data2 = await client.query(format("DELETE FROM deepsleep WHERE userid = %L", userid));
    
        data3 = await client.query(format("DELETE FROM flightsclimbed WHERE userid = %L", userid));
    
        data4 = await client.query(format("DELETE FROM heartrate WHERE userid = %L", userid));
    
        data5 = await client.query(format("DELETE FROM sleep WHERE userid = %L", userid));
    
        data6 = await client.query(format("DELETE FROM sleepheartrate WHERE userid = %L", userid));
    
        data7 = await client.query(format("DELETE FROM stepcounter WHERE userid = %L", userid));
    
        data8 = await client.query(format("DELETE FROM walkingrunningdistance WHERE userid = %L", userid));
    
        data9 = await client.query(format("DELETE FROM userinput WHERE userid = %L", userid));

    } catch (err){
        console.log(err);
    }

    await client.end();

    return {
        data1,
        data2,
        data3,
        data4,
        data5,
        data6,
        data7,
        data8,
        data9
    }
}

module.exports = routes;