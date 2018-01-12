const db = require('./db');

const TABLENAME = 'cars';

class CarDb {
    static getOne(id) {
        id = parseInt(id);
        let query = `SELECT * from ${TABLENAME} where id = ${id}`;
        console.log(query);
        return db.one(query);
    }
}

module.exports = CarDb;