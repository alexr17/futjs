
exports.up = function (knex, Promise) {
    return knex.schema.createTable('nations', function (t) {
            t.increments('id').primary()
            t.string('name')
            t.timestamps(false, true)
    }).then(() => {
        return knex.schema.createTable('leagues', function (t) {
            t.increments('id').primary()
            t.string('name')
            t.timestamps(false, true)
        })
    }).then(() => {
        return knex.schema.createTable('clubs', function (t) {
            t.increments('id').primary()
            t.string('name')
            t.integer('league_id', 11).unsigned().references('id').inTable('leagues');
            t.timestamps(false, true)
        })
    }).then(() => {
        return knex.schema.createTable('card_types', function (t) {
            t.increments('id').primary()
            t.string('name')
            t.timestamps(false, true)
        })
    }).then(() => {
        return knex.schema.createTable('players', function (t) {
            t.increments('id').primary()
            t.integer('club_id', 11).unsigned().references('id').inTable('clubs');
            t.integer('league_id', 11).unsigned().references('id').inTable('leagues');
            t.integer('nation_id', 11).unsigned().references('id').inTable('nations');
            t.integer('card_type_id', 11).unsigned().references('id').inTable('card_types');
            t.timestamps(false, true)
        })
    }).catch((err) => {
        console.log(err)
    })
};

exports.down = function (knex, Promise) {

};
