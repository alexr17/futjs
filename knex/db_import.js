let schema = require('./schema.json')
const knex = require('./knex.js')

const find_or_create_id = async function(obj, type, key='fut_id') {
    const db_obj = await knex.from(type).where(key, obj.data[key])
    let id = null
    if (db_obj.length) {
        //get the id from the resp
        id = db_obj[0].id
    } else {
        //insert nation into the database and return name
        id = (await knex(type).insert(obj.data).returning('id'))[0];
    }
    if (!id) {
        throw "could not get an id for " + type
    }
    return id;
}

module.exports = {
    find_or_create_id
}
/*
    1. Check if nation exists
    2. If not then insert nation object
    3. Check if league exists
    4. If not then insert league object
    5. Check if club exists
    6. If not then insert club object
    2. Insert player object (make sure to return player_id)
    3. Create
*/