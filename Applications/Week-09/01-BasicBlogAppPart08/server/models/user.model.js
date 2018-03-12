class User {
  constructor( obj ) {
    obj && Object.assign( this, obj );

    // don't return these objects from db
    delete this[ 'password' ];
    delete this[ 'security_stamp' ];
  }

  toString() {
    return ``;
  }
}

module.exports = User;
