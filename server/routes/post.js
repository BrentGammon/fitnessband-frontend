const routes = require("express").Router();
const express = require("express");
const pg = require("pg");
const conString = "postgres://postgres:password@localhost:5432/fitnessInfo";
const format = require("pg-format");
const moment = require("moment");
const cors = require("cors");
const fs = require("fs");
const _ = require("lodash");
const app = express();
app.disable('view cache');
const { welchTTest } = require("../../utilties/statistical/statistical");

routes.use(cors());

routes.post("/user/sleepData", async function (req, res) {
  console.log("sleepData");
  if (req.body.data) {
    const dataModel = req.body.data;
    let sleepObject = {};
    let userID = {};
    //fs.writeFileSync("DATA.sql", dataModel);

    //filter out duration of 0
    const filteredDuration = dataModel.filter(item => {
      const data = JSON.parse(item);
      userID = Object.keys(data)[0];
      // console.log("+++++++++++++++++++++++++++++++");
      // console.log(item);
      // console.log("+++++++++++++++++++++++++++++++");
      if (data[userID].hasOwnProperty("sleep_duration") && data[userID].sleep_duration.value !== 0) {
        return data;
      }
      if (data[userID].hasOwnProperty("metadata")) {
        return data;
      }
    });


    console.log(1);
    fs.writeFileSync("filteredDATA.sql", filteredDuration);
    fs.writeFileSync("DATA.sql", dataModel);
    const values = filteredDuration.map(item => {
      const data = JSON.parse(item);
      //console.log(data[userID]);
      userID = Object.keys(data)[0];
      const endDate = moment(
        data[userID].effective_time_frame.time_interval.end_date_time
      ).format("YYYY-MM-DD");

      if (_.has(sleepObject, endDate)) {
        sleepObject[endDate].push(data);
      } else {
        sleepObject[endDate] = [];
        sleepObject[endDate].push(data);
      }
      return data;
    });

    console.log(2);
    //console.log("=========================");
    const timeKeys = Object.keys(sleepObject);

    const dataz = timeKeys.map(item => {
      return sleepObject[item].map(items => {
        //console.log(items);

        //start end datetime
        if (items[userID]["metadata"]) {
          return items[userID]["metadata"].map(i => {
            if (i.key === "Asleep") {
              console.log("Asleep");
              const sleepValue = i["value"];
              return {
                [item]: { sleepDuration: sleepValue },
                startTime:
                  items[userID]["effective_time_frame"]["time_interval"][
                  "start_date_time"
                  ],
                endTime:
                  items[userID]["effective_time_frame"]["time_interval"][
                  "end_date_time"
                  ]
              };
            }
            if (i.key === "Average HR") {
              console.log("heart_rate");
              const ahr = i["value"];
              return {
                [item]: { ahr: ahr },
                startTime:
                  items[userID]["effective_time_frame"]["time_interval"][
                  "start_date_time"
                  ],
                endTime:
                  items[userID]["effective_time_frame"]["time_interval"][
                  "end_date_time"
                  ]
              };
            }
            if (i.key === "Deep Sleep") {
              const deepSleep = i["value"];
              return {
                [item]: { deepSleep: deepSleep },
                startTime:
                  items[userID]["effective_time_frame"]["time_interval"][
                  "start_date_time"
                  ],
                endTime:
                  items[userID]["effective_time_frame"]["time_interval"][
                  "end_date_time"
                  ]
              };
            }
          });
        } else {
          const sleepValue = items[userID]["sleep_duration"]["value"];
          return [
            {
              [item]: { sleepDuration: sleepValue },
              startTime:
                items[userID]["effective_time_frame"]["time_interval"][
                "start_date_time"
                ],
              endTime:
                items[userID]["effective_time_frame"]["time_interval"][
                "end_date_time"
                ]
            }
          ];
        }
      });
    });
    console.log(3);
    let sleepArray = [];
    let deepSleepArray = [];
    let sleepHeartRateArray = [];
    dataz.forEach(item => {
      item.forEach(item => {
        if (item) {
          //console.log(item);
          item.forEach(item => {
            //console.log(item);
            if (item) {
              const objectKeys = Object.keys(item);
              const keyValue = Object.keys(Object.entries(item)[0][1])[0];
              const value = Object.entries(item)[0][1][keyValue];
              const startTime = item.startTime;
              const endTime = item.endTime;
              if (keyValue === "sleepDuration") {
                sleepArray.push([userID, value, startTime, endTime]);
              }

              if (keyValue === "ahr") {
                sleepHeartRateArray.push([userID, value, startTime, endTime]);
              }

              if (keyValue === "deepSleep") {
                deepSleepArray.push([userID, value, startTime, endTime]);
              }
            }
          });
        }
      });
    });
    console.log(4);
    saveSleepData(sleepArray);
    saveDeepSleepData(deepSleepArray);
    saveSleepHeartRate(sleepHeartRateArray);
  }
});

async function saveSleepData(array) {
  const client = new pg.Client(conString);
  await client.connect();

  const query = format(
    "INSERT INTO sleep (userid, duration, startdate, enddate) VALUES %L",
    array
  );
  fs.writeFileSync("sleepData.sql", query);
  const data = await client.query(query);
  await client.end();
  console.log(5);
}

async function saveDeepSleepData(array) {
  const client = new pg.Client(conString);
  await client.connect();

  const query = format(
    "INSERT INTO deepSleep (userid, duration, startdate, enddate) VALUES %L",
    array
  );
  fs.writeFileSync("deepsleepData.sql", query);
  const data = await client.query(query);
  await client.end();
  console.log(6);
}

async function saveSleepHeartRate(array) {
  const client = new pg.Client(conString);
  await client.connect();

  const query = format(
    "INSERT INTO sleepHeartRate (userid, value, startdate, enddate) VALUES %L",
    array
  );
  fs.writeFileSync("sleepheartrateData.sql", query);
  const data = await client.query(query);
  await client.end();
  console.log(7);
}

routes.post("/user/walkingRunningDistance", async function (req, res) {
  console.log("walking");
  if (req.body.data) {
    const client = new pg.Client(conString);
    await client.connect();
    const dataModel = req.body.data;
    const values = dataModel.map(item => {
      const data = JSON.parse(item);
      const userID = Object.keys(data)[0];
      const total = data[userID].unit_value.value;

      const start_date_time =
        data[userID].effective_time_frame.time_interval.start_date_time;
      const end_date_time =
        data[userID].effective_time_frame.time_interval.end_date_time;

      return [userID, total, start_date_time, end_date_time];
    });

    const query = format(
      "INSERT INTO walkingrunningdistance (userid, total, startdate, enddate) VALUES %L",
      values
    );
    fs.writeFileSync("runningdistance.sql", query);
    const data = await client.query(query);
    await client.end();
    res.send(true);
  }
});

routes.post("/user/activeEnergyBurned", async function (req, res) {
  console.log("activeEnergyBurned");
  if (req.body.data) {
    const client = new pg.Client(conString);
    await client.connect();
    const dataModel = req.body.data;
    const values = dataModel.map(item => {
      const data = JSON.parse(item);
      const userID = Object.keys(data)[0];
      const { value } = data[userID].kcal_burned;
      const { start_date_time, end_date_time } = data[
        userID
      ].effective_time_frame.time_interval;

      return [userID, value, start_date_time, end_date_time];
    });
    //console.log(values);
    const query = format(
      "INSERT INTO activeenergyburned (userid, total, startdate, enddate) VALUES %L",
      values
    );
    fs.writeFileSync("energyburned.sql", query);
    const data = await client.query(query);
    await client.end();
    res.send(true);
  }
});

routes.post("/user/flightsClimbed", async function (req, res) {
  console.log("flightsClimbed");
  if (req.body.data) {
    const client = new pg.Client(conString);
    await client.connect();
    const dataModel = req.body.data;
    const values = dataModel.map(item => {
      const data = JSON.parse(item);
      const userID = Object.keys(data)[0];
      const count = data[userID].count;
      const { date_time } = data[userID].effective_time_frame;
      //console.log(date_time);
      return [userID, count, date_time];
    });
    //console.log(values);
    const query = format(
      "INSERT INTO flightsclimbed (userid, total, collectiondate) VALUES %L",
      values
    );
    fs.writeFileSync("flightsclimbed.sql", query);
    const data = await client.query(query);
    await client.end();
    res.send(true);
  }
});

routes.post("/user/stepCounter", async function (req, res, next) {
  console.log(req);
  if (req.body.data) {
    console.log("stepCounter");
    console.log("+=============================");
    console.log(req.body.data);
    console.log("+=============================");
    const client = new pg.Client(conString);
    await client.connect();
    const dataModel = req.body.data;

    const values = dataModel.map(item => {
      const data = JSON.parse(item);
      const userID = Object.keys(data)[0];
      const total = data[userID].step_count;
      const { start_date_time, end_date_time } = data[
        userID
      ].effective_time_frame.time_interval;

      return [userID, total, start_date_time, end_date_time];
    });

    const query = format(
      "INSERT INTO stepcounter (userid, total, startdate, enddate) VALUES %L",
      values
    );
    fs.writeFileSync("stepcounter.sql", query);
    const data = await client.query(query);
    await client.end();
    res.send(true);
  }
});

routes.post("/user/heartrate", async function (req, res) {
  console.log(req.body.data);
  console.log("hereing heartrate");
  if (req.body.data) {
    console.log("heartrate");
    const client = new pg.Client(conString);
    await client.connect();
    const dataModel = req.body.data;
    const values = dataModel.map(item => {
      const data = JSON.parse(item);
      const userID = Object.keys(data)[0];
      const value = data[userID].heart_rate.value;
      const timestamp = data[userID].effective_time_frame.date_time;
      return [userID, value, timestamp];
    });

    const query = format(
      "INSERT INTO heartrate (userid, heartrate, collectiondate) VALUES %L",
      values
    );

    fs.writeFileSync("heartrate.sql", query); //temp item to create data for nik

    const data = await client.query(query);
    await client.end();
  }
});

routes.post("/user/mood", async function (req, res) {
  console.log(req.body.user);
  const {
    uid,
    stress,
    tiredness,
    active,
    healthy
  } = req.body.user;
  const date = req.body.date;
  if (uid) {
    console.log("here");
    const client = new pg.Client(conString);
    await client.connect();
    values = [
      [
        uid,
        stress,
        tiredness,
        active,
        healthy,
        date
      ]
    ];
    const query = format(
      "INSERT INTO userinput (userid, stresslevel,tirednesslevel,activitylevel,healthinesslevel,collectiondate) VALUES %L",
      values
    );
    console.log(query);
    const data = await client.query(query);
    await client.end();
  }
  res.send(values);
});

routes.post("/fitness/queryPage", async function (req, res) {
  //edit this
  console.log("queryPageTest");
  const client = new pg.Client(conString);
  await client.connect();
  const userId = req.body.user.uid;
  const timePeriodString = req.body.user.timePeriod;
  const startTimeString = req.body.user.startTime;
  const endTimeString = req.body.user.endTime;
  let comparision = req.body.user.comparision;
  const moodComparision = req.body.user.moodComparision + "level";
  const mood = req.body.user.mood + "level";
  const today = moment();
  let timePeriods = moment();
  let timePeriodComparision = moment();

  let dateOne;
  switch (startTimeString) {
    case "Today":
      dateOne = format(
        "SELECT " +
        mood +
        " FROM userinput WHERE collectiondate BETWEEN %L AND %L AND userid = %L", //edit
        moment().format("YYYY-MM-DD"), //first selection
        moment()
          .add(1, "days")
          .format(), //second selection
        userId
      );
      break;

    case "This Week":
      dateOne = format(
        "SELECT " +
        mood +
        " FROM userinput WHERE collectiondate BETWEEN %L AND %L AND userid = %L", //edit
        moment()
          .day("Monday")
          .format("YYYY-MM-DD"), //second selection
        moment().format("YYYY-MM-DD"), //first selection
        userId
      );
      break;

    case "Last Week":
      dateOne = format(
        "SELECT " +
        mood +
        " FROM userinput WHERE collectiondate BETWEEN %L AND %L AND userid = %L", //edit
        moment()
          .subtract(7, "days")
          .format("YYYY-MM-DD"), //second selection
        moment().format("YYYY-MM-DD"), //first selection
        userId
      );
      break;
  }

  let dateTwo;
  switch (endTimeString) { //edit
    case "Today":
      dateTwo = format(
        "SELECT " +
        mood +
        " FROM userinput WHERE collectiondate BETWEEN %L AND %L AND userid = %L", //edit
        moment().format("YYYY-MM-DD"), //first selection
        moment()
          .add(1, "days")
          .format(), //second selection
        userId
      );
      break;

    case "This Week":
      //timePeriodComparision = moment().day("Monday");
      dateTwo = format(
        "SELECT " +
        mood +
        " FROM userinput WHERE collectiondate BETWEEN %L AND %L AND userid = %L", //edit
        moment()
          .day("Monday")
          .format("YYYY-MM-DD"), //second selection
        moment().format("YYYY-MM-DD"), //first selection
        userId
      );
      break;

    case "Last Week":
      //timePeriodComparision = moment(today).subtract(7, "days");
      dateTwo = format(
        "SELECT " +
        mood +
        " FROM userinput WHERE collectiondate BETWEEN %L AND %L AND userid = %L", //edit
        moment()
          .subtract(7, "days")
          .format("YYYY-MM-DD"), //second selection
        moment().format("YYYY-MM-DD"), //first selection

        userId
      );
      break;
  }

  switch (comparision) {
    //Less
    //More
    case "Less":
      comparision = "less";
      break;
    case "More":
      comparision = "greater";
      break;
  }

  const data1 = await client.query(dateOne);
  const data2 = await client.query(dateTwo);
  const data1Array = data1.rows;
  const data2Array = data2.rows;

  const data1Values = data1Array.map(item => {
    return item[mood];
  });
  const data2Values = data2Array.map(item => {
    return item[mood];x
  });

  //make call here to function that will anayalse the data returned from the database
  await client.end();

  //console.log(welchTTest(data1Values, data2Values, comparision));

  if (data1Values.length < 2 || data2Values.length < 2) {
    res.status(500).send("Not enough data to test");
  } else {
    res.send(welchTTest(data1Values, data2Values, comparision));
  }

  //todo
  //if none rows are returned send error
});

routes.post("/user/updateSync/:userid", async function (req, res) {
  console.log("here");
  const client = new pg.Client(conString);
  await client.connect();
  const userid = req.params.userid;
  const values = [new Date().toISOString(), userid];
  const query = format(
    "UPDATE userid SET lastSync = %L WHERE userid = %L",
    new Date().toISOString(),
    userid
  );
  //console.log(query);
  const data = await client.query(query);
  await client.end();
  res.send(true);
});

module.exports = routes;
