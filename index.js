require('dotenv').config();
const db_util = require('./knex/db_util.js');
const util = require('./util.js')
const db_import = require('./knex/db_import.js')
const GenericFutObj = require('./generic.js')
const schema = require('./knex/schema.json')
/*
db_util.generate_schema();
*/
const url = "https://www.easports.com/fifa/ultimate-team/api/fut/item?page="
const find_or_create_id = async () => {
    const table_names = ['nations', 'leagues', 'clubs', 'card_types', 'player_stats', 'player_info', 'players']

        const data = await util.http_fetch(url + '1', 'json').then(d => {
            return d;
        }).catch(e => {
            console.log(e)
            return null;
        })
        console.log(data)
        if (data) {
            //execute code
            for (let player_obj of data.items) {
                if (!player_obj.isIcon) {
                    console.log(player_obj)
                }
                let g_nation = await GenericFutObj.prototype.create_fut_object(player_obj, 'nations')
                let g_league = await GenericFutObj.prototype.create_fut_object(player_obj, 'leagues')
                let g_club = await GenericFutObj.prototype.create_fut_object(player_obj, 'clubs', {league_id: g_league.id})
                //let g_ct = await GenericFutObj.prototype.create_fut_object(player_obj, 'card_types')
                //console.log(g_ct)
            }
        }
    GenericFutObj.prototype.kill_knex();
}
find_or_create_id()