const routes = require("express").Router();
const express = require("express");
const pg = require("pg");
const { Pool } = require("pg")
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
const firebase = require("firebase");
const admin = require('../firebaseconfig/firebaseAdmin');
const userInputValues = ["stresslevel", "tirednesslevel", "activitylevel", "healthinesslevel"];
const watchInputValues = ["activeenergyburned", "deepsleep", "flightsclimbed", "heartrate", "sleep", "sleepheartrate", "stepcounter", "walkingrunningdistance"];

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'fitnessInfo',
    password: 'password',
    port: 5432

});

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
    const userid = req.params.userid;
    const client = await pool.connect();
    try {
        let data = await client.query(format("SELECT lastSync FROM userid WHERE userid = %L", userid));
        res.send(data.rows)
    } finally {
        client.release();
    }
});

routes.get("/user/:userid", async function (req, res) {
    const userId = req.params.userid;
    const client = await pool.connect();
    try {
        let data = await client.query(format("SELECT userId FROM userid WHERE userid = %L", userId));
        const response = data.rows;
        res.send(response.length == 0 ? false : true)
    } finally {
        client.release();
    }
});


routes.get("/user/summary/:userid", async function (req, res) {
    let heartRate = await averageWatchData(req.params.userid, 'heartrate', 'heartrate', 'collectiondate', 'heartrate', 'avg');
    let deepsleep = await averageWatchData(req.params.userid, 'deepsleep', 'duration', 'enddate', 'deepsleep', 'avg');
    let sleep = await averageWatchData(req.params.userid, 'sleep', 'duration', 'enddate', 'sleep', 'avg');
    let sleepheartRate = await averageWatchData(req.params.userid, 'sleepheartrate', 'value', 'enddate', 'sleepheartrate', 'avg');
    let activeenergyburned = await averageWatchData(req.params.userid, 'activeenergyburned', 'total', 'enddate', 'activeenergyburned', 'sum');
    let flightsclimbed = await averageWatchData(req.params.userid, 'flightsclimbed', 'total', 'collectiondate', 'flightsclimbed', 'sum');
    let stepcounter = await averageWatchData(req.params.userid, 'stepcounter', 'total', 'enddate', 'stepcounter', 'sum');
    let walkingrunningdistance = await averageWatchData(req.params.userid, 'walkingrunningdistance', 'total', 'enddate', 'walkingrunningdistance', 'sum');

    res.send({
        heartRate: heartRate.rows,
        deepSleep: deepsleep.rows,
        totalSleep: sleep.rows,
        sleepHeartRate: sleepheartRate.rows,
        activeEnergyBurned: activeenergyburned.rows,
        flightsClimbed: flightsclimbed.rows,
        steps: stepcounter.rows,
        walkingRunningDistance: walkingrunningdistance.rows
    });
});

async function averageWatchData(userid, table, valueColumnName, timeStampColumnName, alias, groupingType) {
    const client = await pool.connect();
    try {
        if (groupingType === 'avg') {
            let data = await client.query(format("SELECT ROUND(AVG(%I)) as %I from %I where userid = %L AND %I > date_trunc('day', NOW() - interval '1 month') group by userid", valueColumnName, alias, table, userid, timeStampColumnName));
            return data;
        } else if (groupingType === 'sum') {
            let data = await client.query(format("SELECT ROUND(SUM(%I)) as %I from %I where userid = %L AND %I > date_trunc('day', NOW() - interval '1 month') group by userid", valueColumnName, alias, table, userid, timeStampColumnName));
            return data;
        }
    } finally {
        client.release()
    }
}

function mean(dataSet) {
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

routes.get('/charts/:userid/:startDateValue/:endDateValue/:aggregationValue', async function (req, res) {
    const startDateValue = req.params.startDateValue;
    const endDateValue = req.params.endDateValue;
    const presentTime = moment(new Date(startDateValue)).format("YYYY-MM-DD");
    const enddate = moment(new Date(endDateValue)).format("YYYY-MM-DD");
    const userid = req.params.userid;
    const aggregationValue = req.params.aggregationValue;
    let response;
    let image;
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
        response.data9.rows,
        aggregationValue
    );
    const data = {
        image: image,
        //stats: JSON.parse(response.stats.data)
    }
    console.log(7)
    res.send(data);
});


//todo refactor pooling below 
routes.get("/query1/:userid/:parameter1/:parameter2/:date/", async function (req, res) {
    //:duration
    const userid = req.params.userid;
    const parameter1 = req.params.parameter1;
    const parameter2 = req.params.parameter2;
    const startdate = req.params.date;
    const enddate = moment(new Date(startdate)).subtract(30, 'days').format("YYYY-MM-DD");
    let response;
    let image;
    //user input / user input query
    if (userInputValues.includes(parameter1) && userInputValues.includes(parameter2)) {
        response = await useruserQuery(parameter1, parameter2, userid, startdate, enddate); //check size here

        if (response.data1.rowCount !== 0 || response.data2.rowCount !== 0) {
            console.log("both sets have data")
            image = await getBase64("http://localhost:8000/correlation", 'post',
                response.data1.rows,
                response.data2.rows,
                parameter1,
                parameter2
            );
            response.stats = await datasetInformation(response.data1.rows, response.data2.rows, parameter1, parameter2)
        } else {
            console.log("one or both is empty")
            image = undefined;
            response = undefined;
        }
    }

    //watch / watch query
    if (watchInputValues.includes(parameter1) && watchInputValues.includes(parameter2)) {
        response = await watchwatchQuery(parameter1, parameter2, userid, startdate, enddate);
        if (response && response.data1.rowCount !== 0 && response.data2.rowCount !== 0) {
            image = await getBase64("http://localhost:8000/correlation", 'post',
                response.data1.rows,
                response.data2.rows,
                parameter1,
                parameter2
            );
            response.stats = await datasetInformation(response.data1.rows, response.data2.rows, parameter1, parameter2)
        } else {
            console.log("one or both is empty")
            console.log("watch watch")
            image = undefined;
            response = undefined;
        }
    }



    //broken
    //watch / user query
    if ((watchInputValues.includes(parameter1) && userInputValues.includes(parameter2)) || (watchInputValues.includes(parameter2) && userInputValues.includes(parameter1))) {
        response = await watchuserQuery(parameter1, parameter2, userid, startdate, enddate);
        if (response.data) {
            image = await getBase64("http://localhost:8000/testendpoint", 'post',
                response.data,
                {},
                parameter1,
                parameter2
            );
            response.stats = await datasetInformationMoodWatch(response.data, parameter1, parameter2)

        } else {
            console.log("one or both is empty")
            image = undefined;
            response = undefined;

        }
    }

    let data = {}
    if (image !== undefined || response !== undefined) {
        console.log("data 1")
        data = {
            image: image,
            stats: JSON.parse(response.stats.data)
        }
    } else {
        console.log("data 2")
        data = {
            image: undefined,
            stats: undefined
        }
    }
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
    const client = await pool.connect();
    let watchQuery;
    let moodQuery;
    let moodQueryOneHour;
    let moodQueryThreeHour;
    let moodQuerySixHour;
    let moodQueryTwelveHour;
    let parameter;


    let moodHour;
    let moodThreeHour;
    let moodSixHour;
    let moodTwelveHour;
    let watch;
    let data = {};

    const startdateColumn = ['activeenergyburned', 'stepcounter', 'deepsleep', 'sleep', 'sleepheartrate', 'walkingrunningdistance'];
    const userInputValues = ["stresslevel", "tirednesslevel", "activitylevel", "healthinesslevel"];
    try {


        if (userInputValues.includes(parameter1)) {
            parameter = parameter1;
            //moodHour = await client.query(format("select %I,collectiondate, collectiondate - interval '1 hour' as HourWindow  from userinput where userid = %L and collectiondate > date_trunc('day', to_timestamp(%L) - interval '1 month')", parameter1, userid, moment(startdate, "YYYY-MM-DD").unix()));

            // enddate then startdate
            // select stresslevel,collectiondate, collectiondate - interval '1 hour' as HourWindow  from userinput where userid = 'hr1YPbVK4FWQT6qbnLncnjdUd2W2' and collectiondate > to_timestamp('1507590000') and collectiondate < to_timestamp('1510185600')

            moodHour = await client.query(format("select %I,collectiondate, collectiondate - interval '1 hour' as HourWindow  from userinput where userid = %L and collectiondate > to_timestamp(%L) and collectiondate < to_timestamp(%L)", parameter1, userid, moment(enddate, "YYYY-MM-DD").unix(), moment(startdate, "YYYY-MM-DD").unix()));
            console.log(1)
            moodThreeHour = await client.query(format("select %I,collectiondate, collectiondate - interval '3 hour' as ThreeHourWindow  from userinput where userid = %L and collectiondate > to_timestamp(%L) and collectiondate < to_timestamp(%L)", parameter1, userid, moment(enddate, "YYYY-MM-DD").unix(), moment(startdate, "YYYY-MM-DD").unix()));
            console.log(2)
            moodSixHour = await client.query(format("select %I,collectiondate, collectiondate - interval '6 hour' as SixHourWindow  from userinput where userid = %L and collectiondate > to_timestamp(%L) and collectiondate < to_timestamp(%L)", parameter1, userid, moment(enddate, "YYYY-MM-DD").unix(), moment(startdate, "YYYY-MM-DD").unix()));
            console.log(3)
            moodTwelveHour = await client.query(format("select %I,collectiondate, collectiondate - interval '12 hour' as TweleveHourWindow  from userinput where userid = %L and collectiondate > to_timestamp(%L) and collectiondate < to_timestamp(%L)", parameter1, userid, moment(enddate, "YYYY-MM-DD").unix(), moment(startdate, "YYYY-MM-DD").unix()));
            console.log(4)
            if (startdateColumn.includes(parameter2)) {
                console.log(format("select * from %I where userid = %L and startdate > to_timestamp(%L) and startdate < to_timestamp(%L) order by startdate desc", parameter2, userid, moment(enddate, "YYYY-MM-DD").unix(), moment(startdate, "YYYY-MM-DD").unix()))
                watch = await client.query(format("select * from %I where userid = %L and startdate > to_timestamp(%L) and startdate < to_timestamp(%L) order by startdate desc", parameter2, userid, moment(enddate, "YYYY-MM-DD").unix(), moment(startdate, "YYYY-MM-DD").unix()));
                console.log(5)
            } else {
                console.log(format("select * from %I where userid = %L and collectiondate > to_timestamp(%L) and collectiondate < to_timestamp(%L) order by collectiondate desc", parameter2, userid, moment(enddate, "YYYY-MM-DD").unix(), moment(startdate, "YYYY-MM-DD").unix()))
                watch = await client.query(format("select * from %I where userid = %L and collectiondate > to_timestamp(%L) and collectiondate < to_timestamp(%L) order by collectiondate desc", parameter2, userid, moment(enddate, "YYYY-MM-DD").unix(), moment(startdate, "YYYY-MM-DD").unix()));
                console.log(6)
            }
        }

        if (userInputValues.includes(parameter2)) {
            parameter = parameter2;
            moodHour = await client.query(format("select %I,collectiondate, collectiondate - interval '1 hour' as HourWindow  from userinput where userid = %L and collectiondate > to_timestamp(%L) and collectiondate < to_timestamp(%L)", parameter2, userid, moment(enddate, "YYYY-MM-DD").unix(), moment(startdate, "YYYY-MM-DD").unix()));
            console.log(1)
            moodThreeHour = await client.query(format("select %I,collectiondate, collectiondate - interval '3 hour' as ThreeHourWindow  from userinput where userid = %L and collectiondate > to_timestamp(%L) and collectiondate < to_timestamp(%L)", parameter2, userid, moment(enddate, "YYYY-MM-DD").unix(), moment(startdate, "YYYY-MM-DD").unix()));
            console.log(2)
            moodSixHour = await client.query(format("select %I,collectiondate, collectiondate - interval '6 hour' as SixHourWindow  from userinput where userid = %L and collectiondate > to_timestamp(%L) and collectiondate < to_timestamp(%L)", parameter2, userid, moment(enddate, "YYYY-MM-DD").unix(), moment(startdate, "YYYY-MM-DD").unix()));
            console.log(3)
            moodTwelveHour = await client.query(format("select %I,collectiondate, collectiondate - interval '12 hour' as TweleveHourWindow  from userinput where userid = %L and collectiondate > to_timestamp(%L) and collectiondate < to_timestamp(%L)", parameter2, userid, moment(enddate, "YYYY-MM-DD").unix(), moment(startdate, "YYYY-MM-DD").unix()));
            console.log(4)
            if (startdateColumn.includes(parameter1)) {
                console.log(format("select * from %I where userid = %L and startdate > to_timestamp(%L) and startdate < to_timestamp(%L) order by startdate desc", parameter1, userid, moment(enddate, "YYYY-MM-DD").unix(), moment(startdate, "YYYY-MM-DD").unix()))
                watch = await client.query(format("select * from %I where userid = %L and startdate > to_timestamp(%L) and startdate < to_timestamp(%L) order by startdate desc", parameter1, userid, moment(enddate, "YYYY-MM-DD").unix(), moment(startdate, "YYYY-MM-DD").unix()));
                console.log(5)
            } else {
                console.log(format("select * from %I where userid = %L and collectiondate > to_timestamp(%L) and collectiondate < to_timestamp(%L) order by collectiondate desc", parameter1, userid, moment(enddate, "YYYY-MM-DD").unix(), moment(startdate, "YYYY-MM-DD").unix()))
                watch = await client.query(format("select * from %I where userid = %L and collectiondate > to_timestamp(%L) and collectiondate < to_timestamp(%L) order by collectiondate desc", parameter1, userid, moment(enddate, "YYYY-MM-DD").unix(), moment(startdate, "YYYY-MM-DD").unix()));
                console.log(6)
            }
        }

        moodHour.rows = objectkeyReplace(moodHour.rows, 'collectiondate');
        moodThreeHour.rows = objectkeyReplace(moodThreeHour.rows, 'collectiondate');
        moodSixHour.rows = objectkeyReplace(moodSixHour.rows, 'collectiondate');
        moodTwelveHour.rows = objectkeyReplace(moodTwelveHour.rows, 'collectiondate');


        if (userInputValues.includes(parameter1)) {  //
            if (moodHour.rowCount > 0) {
                moodHour.rows = userInputTotalKey(moodHour.rows, parameter1);
                moodHour.rows = userInputMWLevelKey(moodHour.rows, parameter1);
            }

            if (moodThreeHour.rowCount > 0) {
                moodThreeHour.rows = userInputTotalKey(moodThreeHour.rows, parameter1);
                moodThreeHour.rows = userInputMWLevelKey(moodThreeHour.rows, parameter1);
            }

            if (moodSixHour.rowCount > 0) {
                moodSixHour.rows = userInputTotalKey(moodSixHour.rows, parameter1);
                moodSixHour.rows = userInputMWLevelKey(moodSixHour.rows, parameter1);
            }

            if (moodTwelveHour.rowCount > 0) {
                moodTwelveHour.rows = userInputTotalKey(moodTwelveHour.rows, parameter1);
                moodTwelveHour.rows = userInputMWLevelKey(moodTwelveHour.rows, parameter1);
            }
        } else if (userInputValues.includes(parameter2)) {

            if (moodHour.rowCount > 0) {
                moodHour.rows = userInputTotalKey(moodHour.rows, parameter2);
                moodHour.rows = userInputMWLevelKey(moodHour.rows, parameter2);
            }

            if (moodThreeHour.rowCount > 0) {
                moodThreeHour.rows = userInputTotalKey(moodThreeHour.rows, parameter2);
                moodThreeHour.rows = userInputMWLevelKey(moodThreeHour.rows, parameter2);
            }

            if (moodSixHour.rowCount > 0) {
                moodSixHour.rows = userInputTotalKey(moodSixHour.rows, parameter2);
                moodSixHour.rows = userInputMWLevelKey(moodSixHour.rows, parameter2);
            }

            if (moodTwelveHour.rowCount > 0) {
                moodTwelveHour.rows = userInputTotalKey(moodTwelveHour.rows, parameter2);
                moodTwelveHour.rows = userInputMWLevelKey(moodTwelveHour.rows, parameter2);
            }

        }

        if (moodHour.rowCount > 0) {
            moodHour.rows = objectkeyReplace(moodHour.rows, 'collectiondate', 'startdate');
        }

        if (moodThreeHour.rowCount > 0) {
            moodThreeHour.rows = objectkeyReplace(moodThreeHour.rows, 'collectiondate', 'startdate');
        }

        if (moodSixHour.rowCount > 0) {
            moodSixHour.rows = objectkeyReplace(moodSixHour.rows, 'collectiondate', 'startdate');
        }

        if (moodTwelveHour.rowCount > 0) {
            moodTwelveHour.rows = objectkeyReplace(moodTwelveHour.rows, 'collectiondate', 'startdate');
        }


        if (Object.keys(watch.rows[0]).includes('startdate')) {
            watch.rows = addCollectionDate(watch.rows);
        }

        if (!Object.keys(watch.rows[0]).includes('startdate')) {
            watch.rows = objectkeyReplace(watch.rows, 'collectiondate', 'startdate');
        }


        if (moodHour.rowCount > 0) {
            moodHour = genericFormatForR(moodHour);
        }
        if (moodThreeHour.rowCount > 0) {
            moodThreeHour = genericFormatForR(moodThreeHour);
        }
        if (moodSixHour.rowCount > 0) {
            moodSixHour = genericFormatForR(moodSixHour);
        }
        if (moodTwelveHour.rowCount > 0) {
            moodTwelveHour = genericFormatForR(moodTwelveHour);
        }
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

        data = {
            hourData,
            threeHourData,
            sixHourData,
            twelveHourData
        }


    } finally {
        client.release();
    }


    return {
        data,
        parameter1,
        parameter2
    }
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
    const client = await pool.connect();
    let data1;
    let data2;
    try {
        data1 = await client.query(format("SELECT %I, userid, collectiondate FROM userinput WHERE userid = %L AND collectiondate < %L AND collectiondate > %L", parameter1, userid, startdate, enddate));
        data2 = await client.query(format("SELECT %I, userid, collectiondate FROM userinput WHERE userid = %L AND collectiondate < %L AND collectiondate > %L", parameter2, userid, startdate, enddate));

        data1.rows = objectkeyReplace(data1.rows, 'collectiondate');
        data1.rows = userInputTotalKey(data1.rows, parameter1);

        data2.rows = objectkeyReplace(data2.rows, 'collectiondate');
        data2.rows = userInputTotalKey(data2.rows, parameter2);
    } finally {
        client.release();
    }
    return {
        data1,
        data2,
        parameter1,
        parameter2
    }
}


async function watchwatchQuery(parameter1, parameter2, userid, startdate, enddate) {
    const client = await pool.connect();
    let data1;
    let data2;
    const startdateColumn = ['activeenergyburned', 'stepcounter', 'deepsleep', 'sleep', 'sleepheartrate', 'walkingrunningdistance'];
    //const collectiondateColumn = ['flightsclimbed', 'heartrate'];
    try {
        if (startdateColumn.includes(parameter1)) {
            data1 = await client.query(format("SELECT * FROM %I WHERE userid = %L AND startdate < %L AND startdate > %L", parameter1, userid, startdate, enddate));
            console.log(format("SELECT * FROM %I WHERE userid = %L AND startdate < %L AND startdate > %L", parameter1, userid, startdate, enddate))
        } else {
            data1 = await client.query(format("SELECT * FROM %I WHERE userid = %L AND collectiondate < %L AND collectiondate > %L", parameter1, userid, startdate, enddate));
            console.log(format("SELECT * FROM %I WHERE userid = %L AND collectiondate < %L AND collectiondate > %L", parameter1, userid, startdate, enddate))
        }

        if (startdateColumn.includes(parameter2)) {
            data2 = await client.query(format("SELECT * FROM %I WHERE userid = %L AND startdate < %L AND startdate > %L", parameter2, userid, startdate, enddate));
            console.log(format("SELECT * FROM %I WHERE userid = %L AND startdate < %L AND startdate > %L", parameter2, userid, startdate, enddate))
        } else {
            data2 = await client.query(format("SELECT * FROM %I WHERE userid = %L AND collectiondate < %L AND collectiondate > %L", parameter2, userid, startdate, enddate));
            console.log(format("SELECT * FROM %I WHERE userid = %L AND collectiondate < %L AND collectiondate > %L", parameter2, userid, startdate, enddate))
        }


        if (data1.rowCount !== 0 || data2.rowCount !== 0) {
            console.log("here 1")
            if (!Object.keys(data1.rows[0]).includes('startdate')) {
                data1.rows = objectkeyReplace(data1.rows, 'collectiondate', 'startdate');
            }

            if (!Object.keys(data2.rows[0]).includes('startdate')) {
                data2.rows = objectkeyReplace(data2.rows, 'collectiondate', 'startdate');
            }
            data1 = genericFormatForR(data1);
            data2 = genericFormatForR(data2);
        } else {
            console.log("here 2")
            return null;
        }



    } finally {
        client.release();
    }

    return {
        data1,
        data2,
        parameter1,
        parameter2
    }
}


routes.get("/user/dashboard/plot", async function (req, res) {
    const client = await pool.connect();
    let parameters = req.query.data;
    let uid = req.query.uid;
    let presentTime;
    let enddate;
    let image;
    try {
        if (req.query.startDateValue) {
            presentTime = moment(new Date(req.query.startDateValue)).format("YYYY-MM-DD");
            console.log(presentTime);
        } else {
            presentTime = moment(new Date()).format("YYYY-MM-DD");
        }

        if (req.query.endDateValue) {
            enddate = moment(new Date(req.query.endDateValue)).format("YYYY-MM-DD");
            console.log(enddate);
        } else {
            enddate = moment(new Date()).subtract(3, 'months').format("YYYY-MM-DD");
        }

        let queries = [];
        let data = [];


        if (parameters !== undefined) {

            parameters.forEach(item => {

                if (item === 'walkingrunningdistance' || item === 'stepcounter' || item === 'activeenergyburned') {
                    queries.push(format("SELECT total, startdate as %I from %I where userid = %L AND %I < %L AND %I > %L", 'date', item, uid, "startdate", presentTime, "startdate", enddate))
                }

                if (item === 'sleep' || item === 'deepsleep') {
                    queries.push(format("SELECT duration as total, startdate as %I from %I where userid = %L AND %I < %L AND %I > %L", 'date', item, uid, "startdate", presentTime, "startdate", enddate))
                }

                if (item === 'sleepheartrate') {
                    queries.push(format("SELECT value as total, startdate as %I from %I where userid = %L AND %I < %L AND %I > %L", 'date', item, uid, "startdate", presentTime, "startdate", enddate))
                }

                if (item === 'flightsclimbed') {
                    queries.push(format("SELECT total, collectiondate as %I from %I where userid = %L AND %I < %L AND %I > %L", 'date', item, uid, "collectiondate", presentTime, "collectiondate", enddate))
                }

                if (item === 'heartrate') {
                    queries.push(format("SELECT heartrate as total, collectiondate as %I from %I where userid = %L AND %I < %L AND %I > %L", 'date', item, uid, "collectiondate", presentTime, "collectiondate", enddate))
                }

                //mood version 
                if (userInputValues.includes(item)) {
                    queries.push(format("SELECT %I as total, collectiondate as date from userinput where userid = %L AND collectiondate < %L AND collectiondate > %L", item, uid, presentTime, enddate));
                }

            })
            for (let i = 0; i < queries.length; i++) {
                console.log(queries[i]);
                let temp = await client.query(queries[i])
                data.push(temp.rows);
            }


            image = await getBase64("http://localhost:8000/dashboardplot", 'post',
                data,
                {},
                parameters,
                {}
            );
            //console.log(image)
            //res.send({ image })
        } else {
            image = null
            // res.send({ image })
        }
    } finally {
        client.release();
    }
    res.send(image)
})


async function dashboardCharts(userid, presentTime, enddate) {
    const userId = userid;
    const client = await pool.connect();
    let activeenergyburnedquery1;
    let deepsleepquery2;
    let flightsclimbedquery3;
    let heartratequery4;
    let sleepquery5;
    let sleepheartratequery6;
    let stepcounterquery7;
    let walkingrunningdistancequery8;
    let userinput9;
    try {
        let data1 = await client.query(format("SELECT * FROM activeenergyburned WHERE userid = %L AND startdate < %L AND startdate > %L", userid, presentTime, enddate));
        let data2 = await client.query(format("SELECT * FROM deepsleep WHERE userid = %L AND startdate < %L AND startdate > %L", userid, presentTime, enddate));
        let data3 = await client.query(format("SELECT * FROM flightsclimbed WHERE userid = %L AND collectiondate < %L AND collectiondate > %L", userid, presentTime, enddate));
        let data4 = await client.query(format("SELECT * FROM heartrate WHERE userid = %L AND collectiondate < %L AND collectiondate > %L", userid, presentTime, enddate));
        let data5 = await client.query(format("SELECT * FROM sleep WHERE userid = %L AND startdate < %L AND startdate > %L", userid, presentTime, enddate));
        let data6 = await client.query(format("SELECT * FROM sleepheartrate WHERE userid = %L AND startdate < %L AND startdate > %L", userid, presentTime, enddate));
        let data7 = await client.query(format("SELECT * FROM stepcounter WHERE userid = %L AND startdate < %L AND startdate > %L", userid, presentTime, enddate));
        let data8 = await client.query(format("SELECT * FROM walkingrunningdistance WHERE userid = %L AND startdate < %L AND startdate > %L", userid, presentTime, enddate));
        let data9 = await client.query(format("SELECT * FROM userinput WHERE userid = %L AND collectiondate < %L AND collectiondate > %L", userid, presentTime, enddate));



        if (data1.rowCount > 0 && !Object.keys(data1.rows[0]).includes('startdate')) {
            data1.rows = objectkeyReplace(data1.rows, 'collectiondate', 'startdate');

        }

        if (data2.rowCount > 0 && !Object.keys(data2.rows[0]).includes('startdate')) {
            data2.rows = objectkeyReplace(data2.rows, 'collectiondate', 'startdate');
        }


        if (data3.rowCount > 0 && !Object.keys(data3.rows[0]).includes('startdate')) {
            data3.rows = objectkeyReplace(data3.rows, 'collectiondate', 'startdate');
        }


        if (data4.rowCount > 0 && !Object.keys(data4.rows[0]).includes('startdate')) {
            data4.rows = objectkeyReplace(data4.rows, 'collectiondate', 'startdate');
        }


        if (data5.rowCount > 0 && !Object.keys(data5.rows[0]).includes('startdate')) {
            data5.rows = objectkeyReplace(data5.rows, 'collectiondate', 'startdate');
        }


        if (data6.rowCount > 0 && !Object.keys(data6.rows[0]).includes('startdate')) {
            data6.rows = objectkeyReplace(data6.rows, 'collectiondate', 'startdate');
        }


        if (data7.rowCount > 0 && !Object.keys(data7.rows[0]).includes('startdate')) {
            data7.rows = objectkeyReplace(data7.rows, 'collectiondate', 'startdate');
        }


        if (data8.rowCount > 0 && !Object.keys(data8.rows[0]).includes('startdate')) {
            data8.rows = objectkeyReplace(data8.rows, 'collectiondate', 'startdate');

        }


        if (data9.rowCount > 0 && !Object.keys(data9.rows[0]).includes('startdate')) {
            data9.rows = objectkeyReplace(data9.rows, 'collectiondate', 'startdate');

        }
        if (data1.rowCount > 0) {
            data1 = genericFormatForR(data1);
        }
        if (data2.rowCount > 0) {
            data2 = genericFormatForR(data2);
        }
        if (data3.rowCount > 0) {
            data3 = genericFormatForR(data3);
        }
        if (data4.rowCount > 0) {
            data4 = genericFormatForR(data4);
        }
        if (data5.rowCount > 0) {
            data5 = genericFormatForR(data5);
        }
        if (data6.rowCount > 0) {
            data6 = genericFormatForR(data6);
        }
        if (data7.rowCount > 0) {
            data7 = genericFormatForR(data7);
        }
        if (data8.rowCount > 0) {
            data8 = genericFormatForR(data8);
        }
        if (data9.rowCount > 0) {
            data9 = genericFormatForR(data9);
        }
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

    } finally {
        client.release();
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
            value = error.data;
        });
    console.log(value);
    return value;
}

async function getBase64dashboardcharts(url, httpMethod, data1, data2, data3, data4, data5, data6, data7, data8, data9, aggrValue) {
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
                aggregationValue: aggrValue,
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
            value = error.data;
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
