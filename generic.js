const knex = require('./knex/knex.js')
const db_import = require('./knex/db_import.js')
class GenericFutObj {
    constructor(data, type) {
        this.data = data;
        this.type = type;
    }

}
GenericFutObj.prototype.create_fut_object = async function(player_api_obj, type, table_ids = {}) {
    let row = load_object(player_api_obj[type.slice(0,-1)], Object.keys(this.schema.tables[type]), table_ids, type)
    
    let g = new GenericFutObj(row, type);
    let id = await db_import.find_or_create_id(g, type);
    g.id = id;
    
    return g;
}

GenericFutObj.prototype.create_player_object = async function(player_api_obj, type, table_ids={}) {
    let row = load_object(player_api_obj, Object.keys(this.schema.tables[type]), table_ids, type)
    
    //custom player id tagging
    if (type == 'players') {
        row['base_fut_id'] = Number(player_api_obj['baseId'])
    }

    p = new GenericFutObj(row, type);
    let id = await db_import.find_or_create_id(p, type);
    p.id = id;

    return p;
}

GenericFutObj.prototype.schema = require('./knex/schema.json');
module.exports = GenericFutObj

const load_object = function(api_obj, cols, table_ids, type, key='fut_id') {
    let obj = {}
    //load data into object
    for (let col of cols) {
        obj[col.toLowerCase()] = format(api_obj[col], col, type)
    }
    //set corresponding table ids
    for (let e in table_ids) {
        obj[e] = table_ids[e]
    }
    obj[key] = Number(api_obj['id'])
    return obj;
}

const format = function(val, key, table) {
    const mapping = GenericFutObj.prototype.schema.tables[table][key].mapping
    if (mapping)
        return mapping[val]
    return val
}