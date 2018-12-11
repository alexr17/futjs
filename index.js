require('dotenv').config();
const db_util = require('./knex/db_util.js');
const util = require('./util.js')
const db_import = require('./knex/db_import.js')
const knex = require('./knex/knex.js')
const GenericFutObj = require('./generic.js')
/*
db_util.generate_schema();
*/
const url = "https://www.easports.com/fifa/ultimate-team/api/fut/item?page="
const find_or_create_id = async (type) => {
    const data = await util.http_fetch(url + '1', 'json')
    const g = GenericFutObj.prototype.create_row_object(data.items[0],type)
    const key = 'name';
    const db_obj = await knex.from(type).where(key, g.data[key])
    let id = null
    if (db_obj.length) {
        //get the id from the resp
        id = db_obj[0].id
    } else {
        //insert nation into the database and return name
        id = (await knex(type).insert(g.data).returning('id'))[0];
    }
    if (!id) {
        throw "could not get an id for "
    }
    knex.destroy()
    g.id = id;
    //write to file successfully got id
    return g;
}
find_or_create_id('nations')