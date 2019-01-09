
exports.up = function(knex, Promise) {
    return knex.schema.table('players', t => {
        t.string('headshot_url')
    })
};

exports.down = function(knex, Promise) {
  
};
