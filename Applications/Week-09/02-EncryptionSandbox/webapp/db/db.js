const pgp = require( 'pg-promise' );

const cn = {
  host: process.env.POSTGRES_HOST || 'localhost', // 'localhost' is the default;
  port: process.env.POSTGRES_PORT || 5432, // 5432 is the default;
  database: process.env.POSTGRES_DB || 'postgres',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || ''
};

console.log( cn );
const db = pgp()( cn );

const TABLENAME = 'sandbox';

class SandboxDb {
  static async get() {
    let query = `SELECT * FROM ${TABLENAME} ORDER BY id DESC LIMIT 1`;
    console.log( query );
    return db.oneOrNone( query );
  }

  static async upsert( newData ) {
    let d = await this.get() || {};
    // update data in object
    console.log( d, newData )
    d.data1 = newData.data1 || d.data1;
    d.data2 = newData.data2 || d.data2;
    d.data3 = newData.data3 || d.data3;
    d.data4 = newData.data4 || d.data4;

    let query =
      `UPDATE ${TABLENAME} SET data1=$1, data2=$2, data3=$3, data4=$4, updated_at=$5 WHERE id = $6 RETURNING *`;
    // insert if db entry doesn't already exist
    if ( !d.id ) {
      query =
        `INSERT INTO ${TABLENAME} (data1, data2, data3, data4, updated_at) VALUES($1, $2, $3, $4, $5) RETURNING *`
    }

    let params = [ d.data1, d.data2, d.data3, d.data4, new Date()
      .toISOString(), d.id ];
    console.log( query, params );
    return db.one( query, params );
  }
}

module.exports = SandboxDb;
