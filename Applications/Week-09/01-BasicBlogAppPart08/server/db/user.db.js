const db = require( './db' );

const TABLENAME = 'users';

class UserDb {
  static getByEmail( email, includeDeleted ) {
    let query = `SELECT * FROM ${TABLENAME} WHERE email = $1`;
    if ( !includeDeleted ) {
      query += ' AND is_deleted=false';
    }
    const params = [ email ];
    console.log( query, params );
    return db.oneOrNone( query, params );
  }

  static getOne( id ) {
    const query = `SELECT * FROM ${TABLENAME} WHERE is_deleted=false AND id = $1`;
    const params = [ id ];
    console.log( query, params );
    return db.oneOrNone( query, params );
  }

  static getAll() {
    const query = `SELECT * FROM ${TABLENAME} WHERE is_deleted=false ORDER BY id DESC`;
    console.log( query );
    return db.any( query );
  }

  static updateOne( id, data ) {
    const query = `UPDATE ${TABLENAME} SET username=$1, email=$2 WHERE is_deleted=false AND id = $3 RETURNING *`;
    const params = [ data.username, data.email, data.security_stamp, id ];
    console.log( query, params );
    return db.one( query, params );
  }

  static updatePassword( id, password ) {
    const query = `UPDATE ${TABLENAME} SET password=$1 WHERE is_deleted=false AND id = $2 RETURNING *`;
    const params = [ password, id ];
    console.log( query, params );
    return db.one( query, params );
  }

  static updateSecurityStamp( id, securityStamp ) {
    const query = `UPDATE ${TABLENAME} SET security_stamp=$1 WHERE is_deleted=false AND id = $2 RETURNING *`;
    const params = [ securityStamp, id ];
    console.log( query, params );
    return db.one( query, params );
  }

  static updateForgotPasswordToken( id, securityStamp ) {
    const query =
      `UPDATE ${TABLENAME} SET forgot_password_token=$1, forgot_password_timestamp=$2 WHERE is_deleted=false AND id = $3 RETURNING *`;
    const params = [ securityStamp, securityStamp ? new Date() : null, id ];
    console.log( query, params );
    return db.one( query, params );
  }

  static deleteOne( id ) {
    id = parseInt( id );
    //let query = `DELETE FROM ${TABLENAME} WHERE id = ${id}`;
    let query = `UPDATE ${TABLENAME} SET is_deleted=true WHERE id = ${id}`;
    console.log( query );
    return db.result( query, [], r => r.rowCount );
  }

  static register( username, email, password ) {
    let query =
      `INSERT into ${TABLENAME} (username, email, password) VALUES($1, $2, $3) RETURNING *`;
    let params = [ username, email, password ];
    console.log( query, params );
    return db.one( query, params );
  }

  static getTotal() {
    let query = `SELECT count(*) FROM ${TABLENAME}`;
    console.log( query );
    return db.one( query, [], a => +a.count );
  }

  static search( param ) {
    let query =
      `SELECT * FROM ${TABLENAME} WHERE is_deleted=false AND post ILIKE '%${param}%' OR author ILIKE '%${param}%'`;
    //let query = `SELECT * FROM ${TABLENAME} WHERE is_deleted=false AND make = '${param}'`;
    console.log( query );
    return db.any( query );
  }
}

module.exports = UserDb;
