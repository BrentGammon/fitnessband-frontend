const express = require('express');
const router = express.Router();

const get = require('./get');
const post = require('./post');
const deleteRecords = require('./deleteRecords');
const goals = require('./goals');
const app = express();
app.disable('view cache');

router.use('/get', get);
router.use('/post', post);
router.use('/deleteRecords', deleteRecords);
router.use('/goals', goals)


router.get('/', (req, res) => {
    res.send('api worked!');
})

module.exports = router;