class User {
  constructor( obj ) {
    obj && Object.assign( this, obj );

    // don't return user hash in object
    delete this[ 'password' ];
  }

  toString() {
    return ``;
  }
}

module.exports = User;
