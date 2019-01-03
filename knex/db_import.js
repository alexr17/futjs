const GenericFutObj = require('./generic.js')
const util = require('../public/javascripts/util.js')
const db_util = require('./db_util.js')
const schema = require('./schema.json')
const url = "https://www.easports.com/fifa/ultimate-team/api/fut/item?page="

/**
 * Imports the data from the api
 * @param {Object} api_status 
 */
const import_from_api = async (api_status) => {

    const first_page = await util.http_fetch(url + 1, 'json');
    const max_page = first_page['totalPages'];
    const api_count = first_page['totalResults'];
    const current_count = api_status.total_players;

    console.log(`Current db player count: ${current_count}. API player count: ${api_count}`)

    if (current_count == api_count) {
        console.log("No new players to add. Exiting...")
        return api_status;
    }
    console.log("Going from page: " + api_status.max_page_imported + " through " + max_page)
    
    //get the pages
    const pages = Array.from({length: max_page-api_status.max_page_imported+1}, (_, k) => k+api_status.max_page_imported);
    
    for (let p_num of pages) {

        if (current_count+GenericFutObj.new_objs == api_count) {
            console.log("Finished adding new players. Exiting...")
            break;
        }

        await load_page_wrapper (p_num, api_status);
    }
    console.log(`Done loading ${GenericFutObj.new_objs} fut players into db`);
    api_status.total_players = current_count+GenericFutObj.new_objs;
    return api_status;
}

module.exports = {
    import_from_api: import_from_api
}

/**
 * Wrapper for loading one page of player data
 * @param {Number} p_num 
 * @param {Object} api_status 
 */
const load_page_wrapper = async (p_num, api_status) => {
    let data;
    try {
        data = await util.http_fetch(url + p_num, 'json')
    } catch (err) {
        console.log(err)
        api_status.errored_pages.push(p_num);
        return;
    }
    if (data) {
        const errors = await load_page(data);
        console.log(`Completed page: ${p_num}`)
        
        if (Object.keys(errors) != 0) //check if errors
            console.log(errors)
    }
    api_status.max_page_imported = p_num;
    
}

/**
 * Load player data from one page
 * @param {Object} raw_api_data 
 */
const load_page = async (raw_api_data) => {
    let player_errors = {}
    const table_names = Object.keys(schema.tables)
    
    if (!raw_api_data || !raw_api_data.items) {
        throw "Invalid input"
    }

    for (let player_obj of raw_api_data.items) {
        await load_player (player_obj, player_errors, table_names)
    }
    return player_errors;
}

/**
 * Load player into db
 * @param {Object} player_obj 
 * @param {Object} player_errors 
 * @param {Array<String>} table_names 
 */
const load_player = async (player_obj, player_errors, table_names) => {
    try {
        let table_ids = {}
        for (let table of table_names) {
            if (['nations', 'leagues', 'clubs'].includes(table)) {
                let row = extract_data_from_api(player_obj[table.slice(0,-1)], Object.keys(schema.tables[table]), table_ids, table)
                table_ids[table.slice(0,-1)] = await (new GenericFutObj(row, table)).load_into_db();
            } else if (['player_stats', 'player_info', 'players'].includes(table)) {
                let row = extract_data_from_api(player_obj, Object.keys(schema.tables[table]), table_ids, table);
                //custom player tagging
                if (table == 'players') {
                    row['base_fut_id'] = Number(player_obj['baseId'])    
                }
                table_ids[table] = await (new GenericFutObj(row, table)).load_into_db();
            } else {
                throw ("Invalid table name: " + table + " in load player data")
            }
        }
    } catch (err) {
        console.log(err)
        player_errors.count += 1;
    }
}

/**
 * Format raw api data into object to be loaded into database
 * @param {Object} api_obj 
 * @param {Array<String>} cols 
 * @param {Object} table_ids 
 * @param {String} table_name 
 * @param {String} key 
 */
const extract_data_from_api = function(api_obj, cols, table_ids, table_name, key='fut_id') {
    let obj = {}
    //load data into object
    for (let col of cols) {
        obj[col.toLowerCase()] = format(api_obj[col], col, table_name)
    }
    //set corresponding table ids
    for (let table in table_ids) {
        if (schema.relationships.belongs_to[table_name].includes(table))
            obj[table + "_id"] = table_ids[table]
    }
    obj[key] = Number(api_obj['id'])
    return obj;
}

/**
 * Special schema formatting
 * @param {String} val 
 * @param {String} key 
 * @param {String} table 
 */
const format = function(val, key, table) {
    const mapping = schema.tables[table][key].mapping
    if (mapping)
        return mapping[val]
    return val
}