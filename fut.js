const fetch = require('node-fetch')
const url = "https://www.easports.com/fifa/ultimate-team/api/fut/item?page="
const special_attributes = ['name', 'quality', 'foot', 'position', 'atkWorkRate', 'defWorkRate', 'attributes']

/**
 * A simple async function to get json from a url
 * @param {String} url 
 */
const fetch_json = async url => {
    try {
        const response = await fetch(url);
        const json = await response.json();
        return json;
    } catch (error) {
        console.log(error);
    }
};

/**
 * This async function takes the first player in the database and
 * generates an object based on those parameters
 * @return {Object} the attributes
 */
const load_attributes = async => {
    return fetch_json(url + '1').then(json => {
        const object = json.items[0]
        //console.log(object)
        let attributes = {}
        for (let key in object) {
            attributes[key] = validate_attribute(key, object[key]);
        }
        return attributes
    }).catch(error => {
        console.log(error)
    })
    
}

/**
 * Determines if an attribute is valid (we want to keep it in the database)
 * @param {String} key 
 * @param {String} value 
 */
const validate_attribute = (key, value) => {
    if (typeof(value) == 'object') {
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
    } else if (typeof(value) == 'number' || special_attributes.includes(key)) {
        return true;
    } else {
        return false;
    }
}

load_attributes().then(data => {
    console.log(data)
})