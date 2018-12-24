const fs = require('fs')
const util = require('../util.js')
const knex = require('./knex.js')
let attributes = require('./attributes.json')
let schema = require('./schema.json')

const special_attributes = ['name', 'quality', 'foot', 'position', 'atkWorkRate', 'defWorkRate', 'attributes', 'id']

/**
 * This async function takes the first player in the database and
 * generates an object based on those parameters, writing that object
 * to a file.
 */
const write_attributes = async (url = "https://www.easports.com/fifa/ultimate-team/api/fut/item?page=") => {
    if (Object.keys(attributes).length > 0) return false;
    try {
        const json = await util.http_fetch(url + '1', 'json')
        const object = json.items[0]
        for (let key in object) {
            attributes[key] = validate_attribute(key, object[key]);
        }
        fs.writeFileSync("attributes.json", JSON.stringify(attributes, null, 2));
        return true;
    } catch(error) {
        console.log(error)
        return false;
    }

}

/**
 * Determines if an attribute is valid (we want to keep it in the database)
 * @param {String} key 
 * @param {String} value 
 */
const validate_attribute = (key, value) => {
    if (typeof (value) == 'object') {
        if (Array.isArray(value)) return false;
        let object = {};
        if (key == "league") {
            debugger;
        }
        for (let inner_key in value) {
            object[inner_key] = validate_attribute(inner_key, value[inner_key]);
        }
        if (!Object.values(object).includes(true)) return false;
        return object;
    } else if (typeof (value) == 'number' || special_attributes.includes(key)) {
        return true;
    } else {
        return false;
    }
}

/**
 * Generates the schema for the database in the schema object, which can then be manipulated or written to a file
 */
const generate_db_schema = async () => {
    //TODO: rewrite this cleaner
    const tables = ['players', 'player_stats', 'player_info', 'nations', 'leagues', 'clubs']
    for (let table of tables) {
        const columns = await knex.table(table).columnInfo();
        //console.log(columns)
        for (let key in columns) {
            //TODO: define global variables somewhere instead of here
            if (['created_at', 'updated_at', 'id'].includes(key))
                continue;
            let col = columns[key]
            if (typeof schema.tables[table][key] == 'undefined') {
                schema.tables[table][key] = {
                    type: col.type
                }
            }
        }
    }
    knex.destroy();
    schema.updated_at = Date.now()
    fs.writeFileSync('./knex/schema.json', JSON.stringify(schema, null, 2));
}

module.exports = {
    write_attributes: write_attributes,
    generate_schema: generate_db_schema
}