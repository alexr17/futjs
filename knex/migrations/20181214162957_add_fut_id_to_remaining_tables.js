
exports.up = function(knex, Promise) {
    return knex.schema.table('leagues', t => {
        t.integer("fut_id", 11).unsigned().index()
    }).then(() => {
        return knex.schema.table('nations', t => {
            t.integer("fut_id", 11).unsigned().index()
        })
    }).then(() => {
        return knex.schema.table('clubs', t => {
            t.integer("fut_id", 11).unsigned().index()
        })
    })
};

exports.down = function(knex, Promise) {
  
};
