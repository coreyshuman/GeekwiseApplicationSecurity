const pgp = require('pg-promise');

const cn = {
    host: process.env.POSTGRES_HOST || 'localhost', // 'localhost' is the default;
    port: process.env.POSTGRES_PORT || 5432, // 5432 is the default;
    database: process.env.POSTGRES_DB || 'postgres',
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || ''
};

console.log(cn);
const db = pgp()(cn);

const TABLENAME = 'capture';

class CaptureDb {
    static async get(id) {
        let query = `SELECT * FROM ${TABLENAME} WHERE id = $1 ORDER BY id DESC LIMIT 1`;
        console.log(query);
        return db.oneOrNone(query, [id]);
    }

    static async upsert(newData) {
        let d = {};
        if (newData.id) {
            d = await this.get(newData.id);
        }
        // update data in object
        d.client = newData.client || d.client;
        d.keystrokes = newData.keystrokes || d.keystrokes;

        let query = "";
        if (d.id) {
            query = `UPDATE ${TABLENAME} SET client=$1, keystrokes=$2, WHERE id = $3 RETURNING *`;
            // insert if db entry doesn't already exist
        } else {
            query = `INSERT INTO ${TABLENAME} (client, keystrokes) VALUES($1, $2)`
        }

        let params = [d.client, d.keystrokes, d.id];
        //console.log(query, params);
        return db.none(query, params);

    }
}

module.exports = CaptureDb;