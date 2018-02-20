class Common {
  static resultOk( res, obj ) {
    res.json( { data: obj } );
  }
  static resultErr( res, obj ) {
    res.status( 500 )
      .json( { error: obj } );
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
