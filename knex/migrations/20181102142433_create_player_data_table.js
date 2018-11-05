
exports.up = function(knex, Promise) {
    return knex.schema.createTable('player_stats', function (t) {
        t.increments('id').primary()
        t.integer("composure", 11)
        t.integer("acceleration", 11)
        t.integer("aggression", 11)
        t.integer("agility", 11)
        t.integer("balance", 11)
        t.integer("ballcontrol", 11)
        t.integer("crossing", 11)
        t.integer("curve", 11)
        t.integer("dribbling", 11)
        t.integer("finishing", 11)
        t.integer("freekickaccuracy", 11)
        t.integer("gkdiving", 11)
        t.integer("gkhandling", 11)
        t.integer("gkkicking", 11)
        t.integer("gkpositioning", 11)
        t.integer("gkreflexes", 11)
        t.integer("headingaccuracy", 11)
        t.integer("interceptions", 11)
        t.integer("jumping", 11)
        t.integer("longpassing", 11)
        t.integer("longshots", 11)
        t.integer("marking", 11)
        t.integer("penalties", 11)
        t.integer("positioning", 11)
        t.integer("reactions", 11)
        t.integer("shortpassing", 11)
        t.integer("shotpower", 11)
        t.integer("slidingtackle", 11)
        t.integer("sprintspeed", 11)
        t.integer("standingtackle", 11)
        t.integer("stamina", 11)
        t.integer("strength", 11)
        t.integer("vision", 11)
        t.integer("volleys", 11)
        t.timestamps(false, true)
    }).then(() => {
        return knex.schema.table('players', t => {
            t.integer('player_stats_id', 11).unsigned().references('id').inTable('player_stats');
        })
    })
};

exports.down = function(knex, Promise) {
  
};
