const GenericFutObj = require('./generic.js')
const util = require('../util.js')
const schema = require('./schema.json')


const import_from_api = async (api_status, url="https://www.easports.com/fifa/ultimate-team/api/fut/item?page=") => {

    const max_page = (await util.http_fetch(url + 1, 'json'))['totalPages']
    const pages = Array.from({length: max_page-api_status.max_page_imported+1}, (_, k) => k+api_status.max_page_imported); 
    for (let p_num of pages) {
        try {
            const data = await util.http_fetch(url + p_num, 'json')
            if (data) {
                const errors = await load_player_data(data);
                console.log(`Completed page: ${p_num}`)
                //check if errors have shit
                if (Object.keys(errors) != 0)
                    console.log(errors)
            }
            api_status.max_page_imported = p_num
        }
        catch (err) {
            console.log(err)
            api_status.errored_pages.push(p_num);
        }
    }
    return api_status
}

module.exports = {
    import_from_api: import_from_api
}

const load_player_data = async (raw_api_data) => {
    let player_errors = {}
    const table_names = Object.keys(schema.tables)
    if (raw_api_data)
    {
        for (let player_obj of raw_api_data.items) {
            try {
                let table_ids = {}
                for (let table of table_names) {
                    if (['nations', 'leagues', 'clubs'].includes(table)) {
                        let row = extract_data_from_api(player_obj[table.slice(0,-1)], Object.keys(schema.tables[table]), table_ids, table)
                        let g = new GenericFutObj(row, table);
                        let id = await g.load_into_db();
                        
                        table_ids[table.slice(0,-1) + "_id"] = id;
                        
                    } else if (['player_stats', 'player_info', 'players'].includes(table)) {
                        let row = extract_data_from_api(player_obj, Object.keys(schema.tables[table]), table_ids, table);
                        let g = new GenericFutObj(row, table);
                        let id = await g.load_into_db();
                        //custom player id tagging
                        table_ids[table + "_id"] = id;
                        if (table == 'players') {
                            row['base_fut_id'] = Number(player_obj['baseId'])
                        }
                    } else {
                        throw ("Invalid table name: " + table + " in load player data")
                    }

                    console.log(table_ids)
                }
            } catch (err) {
                console.log(err)
                console.log("Logging failures to data/player_errors.json")
                player_errors.count += 1;
                //player_errors.objs.push(player_obj)
            }
        }
    }
    else {
        throw "No given data!"
    }
    return player_errors;
}

const extract_data_from_api = function(api_obj, cols, table_ids, type, key='fut_id') {
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
    const mapping = schema.tables[table][key].mapping
    if (mapping)
        return mapping[val]
    return val
}