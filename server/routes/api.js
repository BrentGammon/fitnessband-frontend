const express = require('express');
const router = express.Router();

const get = require('./get');
const post = require('./post');
const deleteRecords = require('./deleteRecords');
const app = express();
app.disable('view cache');

router.use('/get', get);
router.use('/post', post);
router.use('/deleteRecords', deleteRecords);


router.get('/', (req, res) => {
    res.send('api worked!');
})

module.exports = router;