const knex = require('./knex.js')

class GenericFutObj {
    constructor(data, type) {
        this.data = data;
        this.type = type;
    }

    async load_into_db() {
        let id = await this.find_or_create_id();
        this.id = id;
        return id;
    }

    async find_or_create_id(key='fut_id') {
        const db_obj = await knex.from(this.type).where(key, this.data[key])
        let id = null;
        if (db_obj.length) {
            //get the id from the resp
            id = db_obj[0].id
        } else {
            //insert and get id
            id = (await knex(this.type).insert(this.data).returning('id'))[0];
        }
        if (!id) {
            throw "Could not get an id for " + this.type
        }
        return id;
    }

}

module.exports = GenericFutObj