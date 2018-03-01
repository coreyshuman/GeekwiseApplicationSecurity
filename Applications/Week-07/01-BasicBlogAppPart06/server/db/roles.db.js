const db = require( './db' );

const TABLENAME = 'roles';
const LINKTABLE = 'user_roles';

class UserDb {
  static getForUser( userId ) {
    const query = `SELECT * FROM ${TABLENAME} as roles ` +
      `JOIN ${LINKTABLE} as ur on roles.id = ur.roles_id ` +
      `WHERE user_id = $1 AND roles.deleted_at is NULL`;
    const params = [ userId ];
    console.log( query, params );
    return db.any( query, params );
  }
}

module.exports = UserDb;
