let schema = require('./schema.json')

const create_row_object = (table_name, obj) => {
    if (table_name == 'players') {
        let player = {}
        const player_cols = Object.keys(schema.tables.players)
        for (let col of player_cols) {
            player[col] = obj[col]
        }
        player['fut_id'] = obj['id']
        player['base_fut_id'] = obj['baseId']
        return player;
    } else if (['nations', 'leagues', 'clubs'].includes(table_name)) {
        let row = {}
        const cols = Object.keys(schema.tables[table_name])
        for (let col of cols) {
            row[col] = obj[table_name.slice(0, -1)][col]
        }
    } else {
        //TODO: this
    }
}

Array.prototype.intersect = function(...a) {
    return [this,...a].reduce((p,c) => p.filter(e => c.includes(e)));
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