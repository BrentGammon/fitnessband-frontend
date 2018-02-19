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

const userInputValues = ["stresslevel", "tirednesslevel", "activitylevel", "healthinesslevel"];
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


routes.get("/user/average/:userid", async function (req, res) {
    //select ROUND(AVG(heartrate)) from heartrate where userid = 'hr1YPbVK4FWQT6qbnLncnjdUd2W2' and collectiondate  > date_trunc('day', NOW() - interval '1 month') group by userid
    //select ROUND(AVG(duration)) from deepsleep where userid = 'hr1YPbVK4FWQT6qbnLncnjdUd2W2' and enddate > date_trunc('day', NOW() - interval '1 month') group by userid
    //select ROUND(AVG(duration)) from sleep where userid = 'hr1YPbVK4FWQT6qbnLncnjdUd2W2' and enddate > date_trunc('day', NOW() - interval '1 month') group by userid
    //select ROUND(AVG(value)) from sleepheartrate where userid = 'hr1YPbVK4FWQT6qbnLncnjdUd2W2' and enddate > date_trunc('day', NOW() - interval '1 month') group by userid
    let heartRate = await averageWatchData(req.params.userid, 'heartrate', 'heartrate', 'collectiondate', 'heartrate', 'avg');
    let deepsleep = await averageWatchData(req.params.userid, 'deepsleep', 'duration', 'enddate', 'deepsleep', 'avg');
    let sleep = await averageWatchData(req.params.userid, 'sleep', 'duration', 'enddate', 'sleep', 'avg');
    let sleepheartRate = await averageWatchData(req.params.userid, 'sleepheartrate', 'value', 'enddate', 'sleepheartrate', 'avg');
    res.send(deepsleep);

    //select ROUND(SUM(total)) from activeenergyburned where userid = 'hr1YPbVK4FWQT6qbnLncnjdUd2W2' and enddate > date_trunc('day', NOW() - interval '1 month') group by userid
    //select ROUND(SUM(total)) from flightsclimbed where userid = 'hr1YPbVK4FWQT6qbnLncnjdUd2W2' and collectiondate > date_trunc('day', NOW() - interval '1 month') group by userid
    //select ROUND(SUM(total)) from stepcounter where userid = 'hr1YPbVK4FWQT6qbnLncnjdUd2W2' and enddate > date_trunc('day', NOW() - interval '1 month') group by userid
    //select ROUND(SUM(total)) from walkingrunningdistance where userid = 'hr1YPbVK4FWQT6qbnLncnjdUd2W2' and enddate > date_trunc('day', NOW() - interval '1 month') group by userid

});



function mean(dataSet) {
    //console.log(dataSet)
    return (
        dataSet.reduce((a, b) => {
            return parseFloat(a) + parseFloat(b);
        }) / dataSet.length
    );
}
function total(dataSet) {
    return (
        dataSet.reduce((a, b) => {
            return parseFloat(a) + parseFloat(b);
        })
    );
}

async function averageWatchData(userid, table, valueColumnName, timeStampColumnName, alias, groupingType) {
    const client = new pg.Client(conString);
    await client.connect();
    let query;
    if (groupingType === 'avg') {
        console.log('here');
        query = format("SELECT ROUND(AVG(%I)) as %I from %I where userid = %L AND %I > date_trunc('day', NOW() - interval '1 month') group by userid", valueColumnName, alias, table, userid, timeStampColumnName);
    } else if (groupingType === 'sum') {
        query = format("SELECT ROUND(SUM(%I)) as %I from %I where userid = %L AND %I > date_trunc('day', NOW() - interval '1 month') group by userid", valueColumnName, alias, table, userid, timeStampColumnName);
    }
    console.log(query)
    const data = await client.query(query);
    //console.log(data);

    await client.end;
    return data;
}
//let query1 = format("SELECT %I, userid, collectiondate FROM userinput WHERE userid = %L AND collectiondate" + "< %L AND collectiondate > %L", parameter1, userid, startdate, enddate);

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

routes.get('/charts/:userid/', async (req, res) => {
    const presentTime = moment(new Date()).format("YYYY-MM-DD");
    const enddate = moment(new Date(presentTime)).subtract(30, 'days').format("YYYY-MM-DD");
    const userid = req.params.userid;
    let response;
    let image;
    console.log(userid);
    console.log(presentTime);
    console.log(enddate);

    response = await dashboardCharts(userid, presentTime, enddate);
    
    image = await getBase64dashboardcharts("http://localhost:8000/dashboardcharts", 'post',
        response.data1.rows,
        response.data2.rows,
        response.data3.rows,
        response.data4.rows,
        response.data5.rows,
        response.data6.rows,
        response.data7.rows,
        response.data8.rows,
        response.data9.rows
    );

    const data = {
        image: image,
        //stats: JSON.parse(response.stats.data)
    }
    res.send(data);
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
    let image;
    //user input / user input query
    if (userInputValues.includes(parameter1) && userInputValues.includes(parameter2)) {
        response = await useruserQuery(parameter1, parameter2, userid, startdate, enddate);

        image = await getBase64("http://localhost:8000/correlation", 'post',
            response.data1.rows,
            response.data2.rows,
            parameter1,
            parameter2
        );
        response.stats = await datasetInformation(response.data1.rows, response.data2.rows, parameter1, parameter2)
        //console.log(response.stats)
    }

    //watch / watch query
    if (watchInputValues.includes(parameter1) && watchInputValues.includes(parameter2)) {
        response = await watchwatchQuery(parameter1, parameter2, userid, startdate, enddate);

        image = await getBase64("http://localhost:8000/correlation", 'post',
            response.data1.rows,
            response.data2.rows,
            parameter1,
            parameter2
        );


        response.stats = await datasetInformation(response.data1.rows, response.data2.rows, parameter1, parameter2)

    }

    //watch / user query
    if ((watchInputValues.includes(parameter1) && userInputValues.includes(parameter2)) || (watchInputValues.includes(parameter2) && userInputValues.includes(parameter1))) {
        response = await watchuserQuery(parameter1, parameter2, userid, startdate, enddate);
        console.log(parameter1)
        console.log(parameter2)
        image = await getBase64("http://localhost:8000/testendpoint", 'post',
            response.data,
            {},
            parameter1,
            parameter2
        );
        //todo data format
        response.stats = await datasetInformationMoodWatch(response.data, parameter1, parameter2)

    }

    //get further information about the datasets




    const data = {
        image: image,
        stats: JSON.parse(response.stats.data)
    }
    //res.send(response);
    res.send(data)

});

async function datasetInformation(dataset1, dataset2, parameter1, parameter2) {
    return await axios.post("http://localhost:8000/datasetInformation", {
        dataset1,
        dataset2,
        parameter1,
        parameter2
    })
}

async function datasetInformationMoodWatch(dataset1, parameter1, parameter2) {
    return await axios.post("http://localhost:8000/datasetInformationMoodWatch", {
        dataset1,
        parameter1,
        parameter2
    })
}

async function watchuserQuery(parameter1, parameter2, userid, startdate, enddate) {
    console.log("watch mood function")
    const client = new pg.Client(conString);
    await client.connect();
    let watchQuery;
    let moodQuery;
    let moodQueryOneHour;
    let moodQueryThreeHour;
    let moodQuerySixHour;
    let moodQueryTwelveHour;
    let parameter;
    const startdateColumn = ['activeenergyburned', 'stepcounter', 'deepsleep', 'sleep', 'sleepheartrate', 'walkingrunningdistance'];
    const userInputValues = ["stresslevel", "tirednesslevel", "activitylevel", "healthinesslevel"];


    if (userInputValues.includes(parameter1)) {
        parameter = parameter1;
        moodQueryOneHour = format("select %I,collectiondate, collectiondate - interval '1 hour' as HourWindow  from userinput where userid = %L and collectiondate > date_trunc('day', to_timestamp(%L) - interval '3 month')", parameter1, userid, moment(startdate, "YYYY-MM-DD").unix());
        moodQueryThreeHour = format("select %I,collectiondate, collectiondate - interval '3 hour' as ThreeHourWindow  from userinput where userid = %L and collectiondate > date_trunc('day', to_timestamp(%L) - interval '3 month')", parameter1, userid, moment(startdate, "YYYY-MM-DD").unix());
        moodQuerySixHour = format("select %I,collectiondate, collectiondate - interval '6 hour' as SixHourWindow  from userinput where userid = %L and collectiondate > date_trunc('day', to_timestamp(%L) - interval '3 month')", parameter1, userid, moment(startdate, "YYYY-MM-DD").unix());
        moodQueryTwelveHour = format("select %I,collectiondate, collectiondate - interval '12 hour' as TweleveHourWindow  from userinput where userid = %L and collectiondate > date_trunc('day', to_timestamp(%L) - interval '3 month')", parameter1, userid, moment(startdate, "YYYY-MM-DD").unix());

        if (startdateColumn.includes(parameter2)) {
            watchQuery = format("select * from %I where userid = %L and startdate  > date_trunc('day', to_timestamp(%L) - interval '3 month') order by startdate desc", parameter2, userid, moment(startdate, "YYYY-MM-DD").unix());
        } else {
            watchQuery = format("select * from %I where userid = %L and collectiondate  > date_trunc('day', to_timestamp(%L) - interval '3 month') order by collectiondate desc", parameter2, userid, moment(startdate, "YYYY-MM-DD").unix());
        }
    }

    if (userInputValues.includes(parameter2)) {
        parameter = parameter2;
        moodQueryOneHour = format("select %I,collectiondate, collectiondate - interval '1 hour' as HourWindow  from userinput where userid = %L and collectiondate > date_trunc('day', to_timestamp(%L) - interval '3 month')", parameter2, userid, moment(startdate, "YYYY-MM-DD").unix());
        moodQueryThreeHour = format("select %I,collectiondate, collectiondate - interval '3 hour' as ThreeHourWindow  from userinput where userid = %L and collectiondate > date_trunc('day', to_timestamp(%L) - interval '3 month')", parameter2, userid, moment(startdate, "YYYY-MM-DD").unix());
        moodQuerySixHour = format("select %I,collectiondate, collectiondate - interval '6 hour' as SixHourWindow  from userinput where userid = %L and collectiondate > date_trunc('day', to_timestamp(%L) - interval '3 month')", parameter2, userid, moment(startdate, "YYYY-MM-DD").unix());
        moodQueryTwelveHour = format("select %I,collectiondate, collectiondate - interval '12 hour' as TweleveHourWindow  from userinput where userid = %L and collectiondate > date_trunc('day', to_timestamp(%L) - interval '3 month')", parameter2, userid, moment(startdate, "YYYY-MM-DD").unix());
        if (startdateColumn.includes(parameter1)) {
            watchQuery = format("select * from %I where userid = %L and startdate  > date_trunc('day', to_timestamp(%L) - interval '3 month') order by startdate desc", parameter1, userid, moment(startdate, "YYYY-MM-DD").unix());
        } else {
            watchQuery = format("select * from %I where userid = %L and collectiondate  > date_trunc('day', to_timestamp(%L) - interval '3 month') order by collectiondate desc", parameter1, userid, moment(startdate, "YYYY-MM-DD").unix());
        }
    }



    let moodHour = await client.query(moodQueryOneHour);
    let moodThreeHour = await client.query(moodQueryThreeHour);
    let moodSixHour = await client.query(moodQuerySixHour);
    let moodTwelveHour = await client.query(moodQueryTwelveHour);
    let watch = await client.query(watchQuery);  //query1


    moodHour.rows = objectkeyReplace(moodHour.rows, 'collectiondate');
    moodThreeHour.rows = objectkeyReplace(moodThreeHour.rows, 'collectiondate');
    moodSixHour.rows = objectkeyReplace(moodSixHour.rows, 'collectiondate');
    moodTwelveHour.rows = objectkeyReplace(moodTwelveHour.rows, 'collectiondate');


    if (userInputValues.includes(parameter1)) {  //
        moodHour.rows = userInputTotalKey(moodHour.rows, parameter1);
        moodHour.rows = userInputMWLevelKey(moodHour.rows, parameter1);

        moodThreeHour.rows = userInputTotalKey(moodThreeHour.rows, parameter1);
        moodThreeHour.rows = userInputMWLevelKey(moodThreeHour.rows, parameter1);

        moodSixHour.rows = userInputTotalKey(moodSixHour.rows, parameter1);
        moodSixHour.rows = userInputMWLevelKey(moodSixHour.rows, parameter1);

        moodTwelveHour.rows = userInputTotalKey(moodTwelveHour.rows, parameter1);
        moodTwelveHour.rows = userInputMWLevelKey(moodTwelveHour.rows, parameter1);
    } else if (userInputValues.includes(parameter2)) {
        moodHour.rows = userInputTotalKey(moodHour.rows, parameter2);
        moodHour.rows = userInputMWLevelKey(moodHour.rows, parameter2);

        moodThreeHour.rows = userInputTotalKey(moodThreeHour.rows, parameter2);
        moodThreeHour.rows = userInputMWLevelKey(moodThreeHour.rows, parameter2);

        moodSixHour.rows = userInputTotalKey(moodSixHour.rows, parameter2);
        moodSixHour.rows = userInputMWLevelKey(moodSixHour.rows, parameter2);

        moodTwelveHour.rows = userInputTotalKey(moodTwelveHour.rows, parameter2);
        moodTwelveHour.rows = userInputMWLevelKey(moodTwelveHour.rows, parameter2);
    }


    await client.end();



    //  if (!Object.keys(moodHour.rows[0]).includes('startdate')) {

    moodHour.rows = objectkeyReplace(moodHour.rows, 'collectiondate', 'startdate');
    moodThreeHour.rows = objectkeyReplace(moodThreeHour.rows, 'collectiondate', 'startdate');
    moodSixHour.rows = objectkeyReplace(moodSixHour.rows, 'collectiondate', 'startdate');
    moodTwelveHour.rows = objectkeyReplace(moodTwelveHour.rows, 'collectiondate', 'startdate');
    //  }

    if (Object.keys(watch.rows[0]).includes('startdate')) {
        watch.rows = addCollectionDate(watch.rows);
    }

    if (!Object.keys(watch.rows[0]).includes('startdate')) {
        watch.rows = objectkeyReplace(watch.rows, 'collectiondate', 'startdate');
    }

    moodHour = genericFormatForR(moodHour);
    moodThreeHour = genericFormatForR(moodThreeHour);
    moodSixHour = genericFormatForR(moodSixHour);
    moodTwelveHour = genericFormatForR(moodTwelveHour);

    watch = genericFormatForR(watch);

    moodHour = moodHour.rows;
    moodThreeHour = moodThreeHour.rows;
    moodSixHour = moodSixHour.rows;
    moodTwelveHour = moodTwelveHour.rows;
    watch = watch.rows;

    let meanParameters = ['heartrate', 'sleepheartrate'];
    let sumParameters = ['activeenergyburned', 'stepcounter', 'walkingrunningdistance', 'sleep', 'flightsclimbed', 'deepsleep'];
    let hourData = []
    let threeHourData = []
    let sixHourData = []
    let twelveHourData = []
    if (meanParameters.includes(parameter1) || meanParameters.includes(parameter2)) {
        hourData = watchMoodFilterMean(moodHour, watch, 'hourwindow', parameter);
        threeHourData = watchMoodFilterMean(moodThreeHour, watch, 'threehourwindow', parameter);
        sixHourData = watchMoodFilterMean(moodSixHour, watch, 'sixhourwindow', parameter);
        twelveHourData = watchMoodFilterMean(moodTwelveHour, watch, 'twelevehourwindow', parameter);
    }
    if (sumParameters.includes(parameter1) || sumParameters.includes(parameter2)) {
        hourData = watchMoodFilterSum(moodHour, watch, 'hourwindow', parameter);
        threeHourData = watchMoodFilterSum(moodThreeHour, watch, 'threehourwindow', parameter);
        sixHourData = watchMoodFilterSum(moodSixHour, watch, 'sixhourwindow', parameter);
        twelveHourData = watchMoodFilterSum(moodTwelveHour, watch, 'twelevehourwindow', parameter);
    }

    let data = {
        hourData,
        threeHourData,
        sixHourData,
        twelveHourData
    }
    //let gobalArray = watchMoodFilter(mood, watch, 'threehourwindow');

    return {
        data,
        //watch,
        parameter1,
        parameter2
    }

    // return {
    //     mood,
    //     watch
    // }
}


function watchMoodFilterMean(mood, watch, period, parameter) {
    let gobalArray = [];
    mood.forEach(moodItem => {
        let tempArray = [];
        watch.forEach(watchItem => {
            if (watchItem.collectiondate < moodItem.collectiondate && watchItem.collectiondate > moodItem[period]) {
                tempArray.push(watchItem.total)
            }
        })
        if (tempArray.length > 0) {
            gobalArray.push([{ collectionDate: moodItem.collectiondate, window: moodItem[period], watch: mean(tempArray), mood: moodItem[parameter] }])
        }
    })
    return gobalArray;
}
function watchMoodFilterSum(mood, watch, period, parameter) {
    let gobalArray = [];
    mood.forEach(moodItem => {
        let tempArray = [];
        watch.forEach(watchItem => {
            if (watchItem.collectiondate < moodItem.collectiondate && watchItem.collectiondate > moodItem[period]) {
                tempArray.push(watchItem.total)
            }
        })
        if (tempArray.length > 0) {
            gobalArray.push([{ collectionDate: moodItem.collectiondate, window: moodItem[period], watch: total(tempArray), mood: moodItem[parameter] }])
        }
    })
    return gobalArray;
}



async function useruserQuery(parameter1, parameter2, userid, startdate, enddate) {
    console.log('hello world');
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

routes.get("/demotest/:userid/:parameter1/:parameter2/:date/", async function (req, res) {
    console.log("demotest")
    const startdateColumn = ['activeenergyburned', 'stepcounter', 'deepsleep', 'sleep', 'sleepheartrate', 'walkingrunningdistance'];
    const userInputValues = ["stresslevel", "tirednesslevel", "activitylevel", "healthinesslevel"];

    
    if(userInputValues.includes(parameter1)){
        query1 = format("SELECT id, %I, collectiondate FROM userinput WHERE userid = %L AND collectiondate " +
        "< %L AND collectiondate > %L ORDER BY collectiondate DESC", parameter1, userid, startdate, enddate);
        //console.log(query1);
        if (startdateColumn.includes(parameter2)) {
            query2 = format("SELECT * FROM %I WHERE userid = %L AND startdate " +
                "< %L AND startdate > %L ORDER BY startdate DESC", parameter2, userid, startdate, enddate);
                //console.log(query2);
        } else {
            query2 = format("SELECT * FROM %I WHERE userid = %L AND collectiondate" +
                "< %L AND collectiondate > %L ORDER BY collectiondate DESC", parameter2, userid, startdate, enddate);
                //console.log(query2);
        }
    }else{
        query1 = format("SELECT id, %I, collectiondate FROM userinput WHERE userid = %L AND collectiondate " +
        "< %L AND collectiondate > %L ORDER BY collectiondate DESC", parameter2, userid, startdate, enddate);

        if (startdateColumn.includes(parameter1)) {
            query2 = format("SELECT * FROM %I WHERE userid = %L AND startdate " +
                "< %L AND startdate > %L ORDER BY startdate DESC", parameter1, userid, startdate, enddate);
        } else {
            query2 = format("SELECT * FROM %I WHERE userid = %L AND collectiondate" +
                "< %L AND collectiondate > %L ORDER BY collectiondate DESC", parameter1, userid, startdate, enddate);
        }
    }
    let data1 = await client.query(query1);
    let data2 = await client.query(query2);
    data1.rows = objectkeyReplace(data1.rows, 'collectiondate');

    if(userInputValues.includes(parameter1)){
        data1.rows = userInputTotalKey(data1.rows, parameter1);
        //data1.rows = userInputMWLevelKey(data1.rows, parameter1);
    }else if(userInputValues.includes(parameter2)){
        data1.rows = userInputTotalKey(data1.rows, parameter2);
        //data1.rows = userInputMWLevelKey(data1.rows, parameter2);       
    }


    const client = new pg.Client(conString);
    await client.connect();
    let date = new Date(req.params.date);


    const query1 = format("select * from %I where userid = %L and collectiondate  > date_trunc('day', to_timestamp(%L) - interval '3 month') order by collectiondate desc", req.params.parameter1, req.params.userid, moment(req.params.date, "YYYY-MM-DD").unix());
    const query2 = format("select %I,collectiondate, collectiondate - interval '3 hour' as ThreeHourWindow  from userinput where userid = %L and collectiondate > date_trunc('day', to_timestamp(%L) - interval '3 month')", req.params.parameter2, req.params.userid, moment(req.params.date, "YYYY-MM-DD").unix());
    //query = format("SELECT ROUND(AVG(%I)) as %I from %I where userid = %L AND %I > date_trunc('day', NOW() - interval '1 month') group by userid", valueColumnName, alias, table, userid, timeStampColumnName);
    // select heartrate, collectiondate from heartrate where userid = 'hr1YPbVK4FWQT6qbnLncnjdUd2W2' and collectiondate  > date_trunc('day', NOW() - interval '3 month') order by collectiondate desc
    //select collectiondate, collectiondate - interval '3 hour' as ThreeHourWindow  from userinput where userid = 'hr1YPbVK4FWQT6qbnLncnjdUd2W2' and collectiondate > date_trunc('day', NOW() - interval '3 month');
    let watch = await client.query(query1);
    let mood = await client.query(query2);
    watch = watch.rows; //watch
    mood = mood.rows; //mood
    await client.end();

    let gobalArray = [];
    mood.forEach(moodItem => {
        //console.log(moodItem)
        let tempArray = [];
        watch.forEach(watchItem => {
            if (watchItem.collectiondate < moodItem.collectiondate && watchItem.collectiondate > moodItem.threehourwindow) {
                tempArray.push(watchItem.heartrate)
            }
        })
        if (tempArray.length > 0) {
            gobalArray.push([{ collectionDate: moodItem.collectiondate, window: moodItem.threehourwindow, mean: mean(tempArray), stress: moodItem.stresslevel }])
        }
    })
    res.send(gobalArray);
})




async function dashboardCharts(userid, presentTime, enddate) {
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

    //const collectiondateColumn = ['flightsclimbed', 'heartrate'];

    activeenergyburnedquery1 = format("SELECT * FROM activeenergyburned WHERE userid = %L AND startdate " +
            "< %L AND startdate > %L", userid, presentTime, enddate);

    deepsleepquery2 = format("SELECT * FROM deepsleep WHERE userid = %L AND startdate" +
            "< %L AND startdate > %L", userid, presentTime, enddate);

    flightsclimbedquery3 = format("SELECT * FROM flightsclimbed WHERE userid = %L AND collectiondate " +
            "< %L AND collectiondate > %L", userid, presentTime, enddate);

    heartratequery4 = format("SELECT * FROM heartrate WHERE userid = %L AND collectiondate" +
            "< %L AND collectiondate > %L", userid, presentTime, enddate);

    sleepquery5 = format("SELECT * FROM sleep WHERE userid = %L AND startdate" +
            "< %L AND startdate > %L", userid, presentTime, enddate);

    sleepheartratequery6 = format("SELECT * FROM sleepheartrate WHERE userid = %L AND startdate" +
            "< %L AND startdate > %L", userid, presentTime, enddate);

    stepcounterquery7 = format("SELECT * FROM stepcounter WHERE userid = %L AND startdate" +
            "< %L AND startdate > %L", userid, presentTime, enddate);

    walkingrunningdistancequery8 = format("SELECT * FROM walkingrunningdistance WHERE userid = %L AND startdate" +
            "< %L AND startdate > %L", userid, presentTime, enddate);

    userinput9 = format("SELECT * FROM userinput WHERE userid = %L AND collectiondate" +
            "< %L AND collectiondate > %L", userid, presentTime, enddate);




    let data1 = await client.query(activeenergyburnedquery1);
    let data2 = await client.query(deepsleepquery2);
    let data3 = await client.query(flightsclimbedquery3);
    let data4 = await client.query(heartratequery4);
    let data5 = await client.query(sleepquery5);
    let data6 = await client.query(sleepheartratequery6);
    let data7 = await client.query(stepcounterquery7);
    let data8 = await client.query(walkingrunningdistancequery8);
    let data9 = await client.query(userinput9);

    await client.end();
    if (!Object.keys(data1.rows[0]).includes('startdate')) {
        data1.rows = objectkeyReplace(data1.rows, 'collectiondate', 'startdate');
    }

    if (!Object.keys(data2.rows[0]).includes('startdate')) {
        data2.rows = objectkeyReplace(data2.rows, 'collectiondate', 'startdate');
    }

    if (!Object.keys(data3.rows[0]).includes('startdate')) {
        data3.rows = objectkeyReplace(data3.rows, 'collectiondate', 'startdate');
    }

    if (!Object.keys(data4.rows[0]).includes('startdate')) {
        data4.rows = objectkeyReplace(data4.rows, 'collectiondate', 'startdate');
    }

    if (!Object.keys(data5.rows[0]).includes('startdate')) {
        data5.rows = objectkeyReplace(data5.rows, 'collectiondate', 'startdate');
    }

    if (!Object.keys(data6.rows[0]).includes('startdate')) {
        data6.rows = objectkeyReplace(data6.rows, 'collectiondate', 'startdate');
    }

    if (!Object.keys(data7.rows[0]).includes('startdate')) {
        data7.rows = objectkeyReplace(data7.rows, 'collectiondate', 'startdate');
    }

    if (!Object.keys(data8.rows[0]).includes('startdate')) {
        data8.rows = objectkeyReplace(data8.rows, 'collectiondate', 'startdate');
    }

    if (!Object.keys(data9.rows[0]).includes('startdate')) {
        data9.rows = objectkeyReplace(data9.rows, 'collectiondate', 'startdate');
    }

    data1 = genericFormatForR(data1);
    data2 = genericFormatForR(data2);
    data3 = genericFormatForR(data3);
    data4 = genericFormatForR(data4);
    data5 = genericFormatForR(data5);
    data6 = genericFormatForR(data6);
    data7 = genericFormatForR(data7);
    data8 = genericFormatForR(data8);
    data9 = genericFormatForR(data9);

    // return await getBase64("http://localhost:8000/correlation", 'post',
    //     genericData1Format.rows,
    //     genericData2Format.rows,
    //     parameter1,
    //     parameter2
    // );

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
    console.log(value);
    return value;
}

async function getBase64dashboardcharts(url, httpMethod, data1, data2, data3, data4, data5, data6, data7, data8, data9) {
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
                dataset3: data3,
                dataset4: data4,
                dataset5: data5,
                dataset6: data6,
                dataset7: data7,
                dataset8: data8,
                dataset9: data9,
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
    console.log(value);
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
            if (Object.keys(data.rows[0]).includes('startdate')) {
                //sleep heart rate 
                for (let i = 0; i < data.rows.length; i++) {
                    data.rows[i].collectiondate = data.rows[i]['startdate'];
                }
            }
        }

    }
    //console.log(data.rows);
    return data
}

function userInputTotalKey(obj, moodKey) {
    for (let i = 0; i < obj.length; i++) {
        obj[i].total = obj[i][moodKey];
    }
    return obj;
}

function userInputMWLevelKey(obj, moodKey) {
    for (let i = 0; i < obj.length; i++) {
        obj[i].level = obj[i][moodKey];
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

function addCollectionDate(obj) {
    for (let i = 0; i < obj.length; i++) {
        obj[i].collectiondate = obj[i]['startdate'];

    }
    return obj;
}

module.exports = routes;
