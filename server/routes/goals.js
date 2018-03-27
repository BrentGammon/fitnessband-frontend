const routes = require("express").Router();
const express = require("express");
const pg = require("pg");
const { Pool } = require("pg")
const conString = "postgres://postgres:password@localhost:5432/fitnessInfo";
const app = express();
app.disable('view cache');
const cors = require("cors");
routes.use(cors());
const format = require("pg-format");
const moment = require("moment");


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'fitnessInfo',
    password: 'password',
    port: 5432

});


routes.get('/:userid', async function (req, res) {
    const userid = req.params.userid;
    const client = await pool.connect();
    try {

        let goals = await client.query(format("SELECT * FROM goals WHERE userid = %L", userid));
        const startRange = moment().format("DD-MM-YYYY");
        const endRange = moment().subtract(7, 'days').format("DD-MM-YYYY")


        const jsonArray = [];
        for (let i = 0; i < goals.rows.length; i++) {
            //sum
            if (goals.rows[i].variable === 'steps') {
                let data = await client.query(format("SELECT SUM(total) from stepcounter where userid = %L and enddate <= to_timestamp(%L, 'DD-MM-YYYY') and enddate >= to_timestamp(%L, 'DD-MM-YYYY') group by userid", userid, startRange, endRange));
                if (data.rows[0]) {
                    jsonArray.push({ data: goals.rows[i], "current": data.rows[0].sum });
                } else {
                    jsonArray.push({ data: goals.rows[i], "current": 0 });
                }
            }
            if (goals.rows[i].variable === 'activeEnergyBurned') {
                let data = await client.query(format("SELECT SUM(total) from activeenergyburned where userid = %L and enddate <= to_timestamp(%L, 'DD-MM-YYYY') and enddate >= to_timestamp(%L, 'DD-MM-YYYY') group by userid", userid, startRange, endRange));
                if (data.rows[0]) {
                    jsonArray.push({ data: goals.rows[i], "current": data.rows[0].sum });
                } else {
                    jsonArray.push({ data: goals.rows[i], "current": 0 });
                }

            }

            if (goals.rows[i].variable === 'flightsClimbed') {
                let data = await client.query(format("SELECT SUM(total) from flightsClimbed where userid = %L and collectiondate <= to_timestamp(%L, 'DD-MM-YYYY') and collectiondate >= to_timestamp(%L, 'DD-MM-YYYY') group by userid", userid, startRange, endRange));
                if (data.rows[0]) {
                    jsonArray.push({ data: goals.rows[i], "current": data.rows[0].sum });
                } else {
                    jsonArray.push({ data: goals.rows[i], "current": 0 });
                }
            }

            if (goals.rows[i].variable === 'walkingRunningDistance') {
                let data = await client.query(format("SELECT SUM(total) from walkingrunningdistance where userid = %L and enddate <= to_timestamp(%L, 'DD-MM-YYYY') and enddate >= to_timestamp(%L, 'DD-MM-YYYY') group by userid", userid, startRange, endRange));
                if (data.rows[0]) {
                    jsonArray.push({ data: goals.rows[i], "current": data.rows[0].sum });
                } else {
                    jsonArray.push({ data: goals.rows[i], "current": 0 });
                }
            }


            if (goals.rows[i].variable === 'deepSleep') {
                let data = await client.query(format("SELECT SUM(duration) from deepsleep where userid = %L and enddate <= to_timestamp(%L, 'DD-MM-YYYY') and enddate >= to_timestamp(%L, 'DD-MM-YYYY') group by userid", userid, startRange, endRange));
                if (data.rows[0]) {
                    jsonArray.push({ data: goals.rows[i], "current": data.rows[0].sum });
                } else {
                    jsonArray.push({ data: goals.rows[i], "current": 0 });
                }
            }

            if (goals.rows[i].variable === 'totalSleep') {
                let data = await client.query(format("SELECT SUM(duration) from sleep where userid = %L and enddate <= to_timestamp(%L, 'DD-MM-YYYY') and enddate >= to_timestamp(%L, 'DD-MM-YYYY') group by userid", userid, startRange, endRange));
                if (data.rows[0]) {
                    jsonArray.push({ data: goals.rows[i], "current": data.rows[0].sum });
                } else {
                    jsonArray.push({ data: goals.rows[i], "current": 0 });
                }
            }
            //average
            if (goals.rows[i].variable === 'heartRate') {
                let data = await client.query(format("SELECT AVG(heartrate) FROM heartrate where userid = %L AND collectiondate <= to_timestamp(%L, 'DD-MM-YYYY') and collectiondate >= to_timestamp(%L, 'DD-MM-YYYY') group by userid", userid, startRange, endRange))
                if (data.rows[0]) {
                    jsonArray.push({ data: goals.rows[i], "current": data.rows[0].avg });
                } else {
                    jsonArray.push({ data: goals.rows[i], "current": 0 });
                }
            }
        }

        res.send(jsonArray)
    } finally {
        client.release();
    }
})


routes.post('/', async function (req, res) {
    const client = await pool.connect();
    try {
        let data = await client.query(format("INSERT INTO goals (userId, variable, goalValue) VALUES (%L, %L, %L)", req.body.uid, req.body.variable, req.body.goalValue));
        res.send(data)
    } finally {
        client.release();
    }

})

routes.delete('/:userid/:id', async function (req, res) {
    const userid = req.params.userid;
    const id = req.params.id;
    const client = await pool.connect();
    try {
        let data = await client.query(format("DELETE FROM goals WHERE userid = %L AND id = %L", userid, id));
        res.send(data.rows)
    } finally {
        client.release();
    }
})

module.exports = routes;