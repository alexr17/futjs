
exports.up = function(knex, Promise) {
    return knex.schema.table('player_info', t => {
        t.integer("fut_id", 11).unsigned().index()
    }).then(() => {
        return knex.schema.table('player_stats', t => {
            t.integer("fut_id", 11).unsigned().index()
        })
    })
};

exports.down = function(knex, Promise) {
  
};
