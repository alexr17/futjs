const GenericFutObj = require('./generic.js')
const util = require('../util.js')


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
/*
    1. Check if nation exists
    2. If not then insert nation object
    3. Check if league exists
    4. If not then insert league object
    5. Check if club exists
    6. If not then insert club object
    2. Insert player object (make sure to return player_id)
    3. Create
*/