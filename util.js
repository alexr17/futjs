const fetch = require('node-fetch')
/**
 * A simple async function to get json from a url
 * @param {String} url 
 */
const http_fetch = async (url, type = 'html') => {
    try {
        const response = await fetch(url);
        if (type == 'html')
            return response.text();
        else if (type == 'json')
            return response.json();
        else
            throw "Invalid type specified"
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    http_fetch
}