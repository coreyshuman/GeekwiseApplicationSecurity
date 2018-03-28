class Common {
  static resultOk( res, obj ) {
    if ( typeof obj === 'string' || obj === null || obj === undefined ) {
      res.json( { message: obj ? obj : 'ok' } );
    } else {
      res.json( { data: obj } );
    }
  }
  static resultErr( res, obj ) {
    let payload = {};
    if ( typeof obj === 'string' || obj === null || obj === undefined ) {
      payload = { message: obj ? obj : 'error' };
    } else {
      payload = { error: obj };
    }
    res.status( 500 )
      .json( payload );
  }
  static resultNotFound( res, msg ) {
    res.status( 404 )
      .json( { message: msg ? msg : 'Not Found' } );
  }
  static userAlreadyExists( res ) {
    res.status( 403 )
      .json( { message: 'User already exists.' } );
  }

  static userNotAuthorized( res ) {
    res.status( 403 )
      .json( { message: 'You are not logged in.' } );
  }
}

module.exports = Common;
