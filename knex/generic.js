const knex = require('./knex.js')

class GenericFutObj {
    constructor(data, type) {
        this.data = data;
        this.type = type;
    }

    static async get_obj(type, key, val, init_obj=true) {
        const data = (await knex(type).where({[key]: val}))[0];
        if (init_obj)
            return new this(data, type);
        return data;
    }
}

/**
 * Load self into db (async)
 */
GenericFutObj.prototype.load_into_db = async () => {
    let id = await GenericFutObj.prototype.find_or_create_id.call(this);
    this.id = id;
    return id;
}

/**
 * Load object or get id from db (async)
 * @param {String} key 
 */
GenericFutObj.prototype.find_or_create_id = async (key = 'fut_id') => {
    const db_obj = await knex.from(this.type).where(key, this.data[key])
    let id = null;
    if (db_obj.length) {
        //get the id from the resp
        id = db_obj[0].id
    } else {
        //insert and get id
        id = (await knex(this.type).insert(this.data).returning('id'))[0];
        if (this.type == "players") {
            GenericFutObj.new_objs++;
        }
    }
    if (!id) {
        throw "Could not get an id for " + this.type
    }
    return id;
}

GenericFutObj.new_objs = 0;

module.exports = GenericFutObj