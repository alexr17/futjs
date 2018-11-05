
exports.up = function (knex, Promise) {
    return knex.schema.createTable('player_info', function (t) {
        t.increments('id').primary()
        t.integer('height', 11)
        t.integer('weight', 11)
        t.integer('age', 11)
        t.boolean('foot', 11)
        t.specificType('skillmoves', 'tinyint(1)');
        t.specificType('quality', 'tinyint(1)');
        t.specificType('atkworkrate', 'tinyint(1)');
        t.specificType('defworkrate', 'tinyint(1)');
        t.integer('rarityid', 11)
        t.timestamps(false, true)
    }).then(() => {
        return knex.schema.table('players', t => {
            t.string('position')
            t.integer('player_info_id', 11).unsigned().references('id').inTable('player_info');
        })
    })
};

exports.down = function (knex, Promise) {

};
