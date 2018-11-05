const fetch = require('node-fetch')
/**
 * A simple async function to get json from a url
 * @param {String} url 
 */
const http_fetch = async (url, type = 'html') => {
    const response = await fetch(url).catch((err) => console.log(err));

    if (type == 'html')
        return response.text();
    else if (type == 'json')
        return response.json();
    throw "Error in http_fetch: Invalid type specified"

};
module.exports = {
    http_fetch
}