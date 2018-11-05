
exports.up = function(knex, Promise) {
    return knex.schema.table('players', t => {
        t.string("name")
        t.integer("fut_id", 11).unsigned().index()
        t.integer("base_fut_id", 11).unsigned().index()
        t.integer("rating", 11).unsigned()
    })
};

exports.down = function(knex, Promise) {
  
};
