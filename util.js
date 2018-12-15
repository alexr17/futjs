const fetch = require('node-fetch')
const isOnline = require('is-online');
let throttle = Date.now()
const is_online = async () => {
	return await isOnline();
	//=> true
}
/**
 * A simple async function to get json from a url
 * @param {String} url 
 */
const http_fetch = async (url, type = 'html') => {
    //short timeout because we have a lot of pages to get through
    if (throttle + 1000 > Date.now()) {
        console.log("Notice: api is being hit faster than once per second")
        await sleep(1000) // sleep for a second
    }
    throttle = Date.now();
    const response = await fetch(url, { timeout: 5000 })
    
    
    if (type == 'html')
        return response.text();
    else if (type == 'json')
        return response.json();
    throw "Error in http_fetch: Invalid type specified"

};
module.exports = {
    http_fetch
}
function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}