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

const TABLENAME = 'sandbox';

class SandboxDb {
    static async get() {
        let query = `SELECT * FROM ${TABLENAME} ORDER BY id DESC LIMIT 1`;
        console.log(query);
        return db.oneOrNone(query);
    }

    static async upsert(newData) {
        let d = await this.get() || {};
        // update data in object
        console.log(d, newData)
        d.content = newData.content || d.content;
        d.attribute = newData.attribute || d.attribute;
        d.css = newData.css || d.css;
        d.javascript = newData.javascript || d.javascript;

        let query = `UPDATE ${TABLENAME} SET content=$1, attribute=$2, css=$3, javascript=$4, updated_at=$5 WHERE id = $6 RETURNING *`;
        // insert if db entry doesn't already exist
        if (!d.id) {
            query = `INSERT INTO ${TABLENAME} (content, attribute, css, javascript, updated_at) VALUES($1, $2, $3, $4, $5) RETURNING *`
        }

        let params = [d.content, d.attribute, d.css, d.javascript, new Date().toISOString(), d.id];
        console.log(query, params);
        return db.one(query, params);
    }
}

module.exports = SandboxDb;