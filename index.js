require('dotenv').config();
const db_import = require('./knex/db_import.js')
const fs = require('fs');

let api_status = require('./data/api_progress');
//let player_errors = require('./data/player_errors.json');

db_import.import_from_api(api_status).then(api_status => {
    //fs.writeFileSync("data/player_errors.json", JSON.stringify(player_errors, null, 2))
    fs.writeFileSync("data/api_progress.json", JSON.stringify(api_status, null, 2))
    console.log("Done loading data into db")
}).finally(_=> {
    require('./knex/knex.js').destroy()
})