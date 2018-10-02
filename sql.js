const fs = require('fs')

class Sql {
    constructor(password="", database="", user = 'root', host = '127.0.0.1') {
        if (fs.existsSync('database.json')) {
            const db_config = require('./database.json')
            this.password = db_config.password;
            this.host = db_config.host;
            this.user = db_config.user;
            this.db = db_config.database;
        } else {
            this.password = password;
            this.host = host;
            this.user = user;
            this.db = database;
        }

    }

    connect() {
        let knex = require('knex')({
            client: 'mysql',
            connection: {
                host: this.host,
                user: this.user,
                password: this.password,
                database: this.db
            }
        });

        return knex
    }

}

module.exports = Sql