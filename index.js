require('dotenv').config();
const util = require('./util.js')
const GenericFutObj = require('./generic.js')
const fs = require('fs')
let player_errors = {count: 0, objs: []}//require('./data/player_errors.json')
let api_status = require('./data/api_progress');
const url = "https://www.easports.com/fifa/ultimate-team/api/fut/item?page="
const import_data = async () => {

    const pages = api_status.errored_pages.concat(Array.from({length: api_status.total_pages - api_status.pages_imported}, (_, k) => k + api_status.pages_imported)); 
    for (let p_num of pages) {
        try {
            const data = await util.http_fetch(url + p_num, 'json')
            if (data) {
                const errors = load_player_data(data);
                //check if errors have shit
            }
        }
        catch (err) {
            console.log(err)
            api_status.errored_pages.push(p_num);
        }
    }
}
import_data().then(_=> {
    fs.writeFileSync("data/player_errors.json", JSON.stringify(player_errors, null, 2))
    fs.writeFileSync("data/api_progress.json", JSON.stringify(api_status, null, 2))
    require('./knex/knex.js').destroy()
})
const load_player_data = async (raw_api_data) => {
    if (raw_api_data)
    {
        for (let player_obj of raw_api_data.items) {
            try {
                let g_nation = await GenericFutObj.prototype.create_fut_object(player_obj, 'nations')
                let g_league = await GenericFutObj.prototype.create_fut_object(player_obj, 'leagues')
                let g_club = await GenericFutObj.prototype.create_fut_object(player_obj, 'clubs', {league_id: g_league.id})
                let g_pinfo = await GenericFutObj.prototype.create_player_object(player_obj, 'player_info')
                let g_pstats = await GenericFutObj.prototype.create_player_object(player_obj, 'player_stats')
                let g_player = await GenericFutObj.prototype.create_player_object(player_obj, 'players', 
                {
                    league_id: g_league.id,
                    nation_id: g_nation.id,
                    club_id: g_club.id,
                    player_info_id: g_pinfo.id,
                    player_stats_id: g_pstats.id
                })
            } catch (err) {
                console.log(err)
                console.log("Logging failures to data/player_errors.json")
                player_errors.count += 1;
                player_errors.objs.push(player_obj)
            }
        }
    }
    else {
        throw "No given data!"
    }
    return player_errors;
}