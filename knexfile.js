// Update with your config settings.
require('dotenv').config();
module.exports = {

  development: {
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    },
    migrations: {
      directory: './knex/migrations',
      tableName: 'knex_migrations',
    },
    pool: {
      min: 2,
      max: 50,
    }
  }

};
