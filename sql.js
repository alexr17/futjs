const fs = require('fs')

/** 
 * This is a wrapper around the knex sql query builder.
 * Because I'm putting this on github I'm going to keep all
 * my login information private and create a framework for doing
 * so in the future.
 */
class Sql {
    /**
     * 
     * @param {String} password 
     * @param {String} database 
     * @param {String} user 
     * @param {String} host
     * @return {null}
     */
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

    /**
     * This function establishes a connection for a sql instance
     * and returns the knex object it creates.
     * @return {Object} the knex object
     */
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