const fs = require('fs')
const util = require('./util.js')
let attributes = require('./attributes.json')

const url = "https://www.easports.com/fifa/ultimate-team/api/fut/item?page="
const special_attributes = ['name', 'quality', 'foot', 'position', 'atkWorkRate', 'defWorkRate', 'attributes', 'id']

/**
 * This async function takes the first player in the database and
 * generates an object based on those parameters, writing that object
 * to a file.
 */
const write_attributes = async () => {
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

write_attributes();

const parse_fut_data = async => {

}

const parse_page = async => {

}

const parse_player = async => {

}