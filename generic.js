knex = require('./knex/knex.js')
class GenericFutObj {
    constructor(data, type) {
        this.data = data;
        this.type = type;
    }

}
GenericFutObj.prototype.create_row_object = async function(player_api_obj, type, table_ids = {}, key='name') {
    let row = {}
    const cols = Object.keys(this.schema.tables[type])

    //set the basic information from the schema 
    for (let col of cols) {
        row[col] = player_api_obj[type.slice(0, -1)][col]
    }
    //set corresponding table ids
    for (let e in table_ids) {
        row[e] = table_ids[e]
    }
    const g = new GenericFutObj(row, type);
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
        throw "could not get an id for " + type
    }
    
    g.id = id;
    //write to file successfully got id
    return g;
}

GenericFutObj.prototype.create_player_object = async function(player_api_obj, type, table_ids={}, key='fut_id')

GenericFutObj.prototype.kill_knex = function() {
    knex.destroy();
}
GenericFutObj.prototype.schema = require('./knex/schema.json');
module.exports = GenericFutObj