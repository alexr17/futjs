require('dotenv').config();
const db_import = require('./knex/db_import.js');
const db_util = require('./knex/db_util.js');
const fs = require('fs');

let api_status = require('./private/data/api_progress');
//db_util.generate_schema();

db_import.import_from_api(api_status).then(api_status => {
    fs.writeFileSync("./private/data/api_progress.json", JSON.stringify(api_status, null, 2));
}).finally(_=> {
    require('./knex/knex.js').destroy();
})