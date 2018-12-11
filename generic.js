class GenericFutObj {
    constructor(data, type) {
        this.data = data;
        this.type = type;
    }

}
GenericFutObj.prototype.create_row_object = function(player_api_obj, type) {
    let row = {}
    const cols = Object.keys(this.schema.tables[type])
    for (let col of cols) {
        row[col] = player_api_obj[type.slice(0, -1)][col]
    }
    return new GenericFutObj(row, type);
}
GenericFutObj.prototype.schema = require('./knex/schema.json');
module.exports = GenericFutObj