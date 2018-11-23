require('dotenv').config();
const db_util = require('./knex/db_util.js');
const util = require('./util.js')
/*
db_util.generate_schema();
*/
const url = "https://www.easports.com/fifa/ultimate-team/api/fut/item?page="
util.http_fetch(url + '1', 'json').then(data => {
    console.log(data)
}).catch(err => {
    console.log(err)
})