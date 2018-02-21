const express = require( 'express' );
const router = express.Router();
const UserDb = require( '../db/user.db' );
const User = require( '../models/user.model' );
const bcrypt = require( 'bcryptjs' );

const SALT_ROUNDS = parseInt( process.env.SALT_ROUNDS );

router.get( '/login', function( req, res, next ) {
  let m = null;
  switch ( req.query.m ) {
    case 'registered':
      m = 'Your account was created. Please log in.';
      break;
  }

  res.render( 'login', { csrfToken: req.csrfToken && req.csrfToken(), message: m } );
} );

router.post( '/login', async function( req, res, next ) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const data = await UserDb.getByEmail( email );
    if ( data ) {
      const result = await bcrypt.compare( password, data.password );
      if ( result ) {
        const user = new User( data );
        req.session.user = JSON.stringify( user );
        return res.redirect( `/users/welcome?username=${user.username}` );
        //return res.render( 'welcome' );
      } else {
        return res.render( 'login', { csrfToken: req.csrfToken && req.csrfToken(), error: LOGIN_FAIL } );
      }
    } else {
      // in debug mode we could say user doesn't exist here
      // calculate hash to create a delay (don't leak fact that user doesn't exist)
      const hash = await bcrypt.hash( password, SALT_ROUNDS );
      return res.render( 'login', { csrfToken: req.csrfToken && req.csrfToken(), error: LOGIN_FAIL } );
    }
  } catch ( e ) {
    // handle error
    console.log( `Error: ${e.message}` );
    return res.render( 'login', { csrfToken: req.csrfToken && req.csrfToken(), error: e.message } );
  }
} );

router.get( '/logout', function( req, res, next ) {
  let m = null;
  let e = null;
  switch ( req.query.m ) {
    case 'expired':
      e = 'Your credentials have expired. Please log in.';
      break;
  }

  res.render( 'logout', { message: m, error: e } );
} );

router.get( '/register', async function( req, res, next ) {
  res.render( 'register', {
    csrfToken: req.csrfToken && req.csrfToken(),
    email: '',
    username: ''
  } );
} );

router.post( '/register', async function( req, res, next ) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;
    // check if username is available
    const data = await UserDb.getByEmail( email );
    if ( data ) {
      // user already exists
      // calculate hash anyway to create a delay (discourage email snooping)
      const hash = await bcrypt.hash( password, SALT_ROUNDS );
      throw new Error( "User already exists." );
    } else {
      // calculate hash
      const hash = await bcrypt.hash( password, SALT_ROUNDS );
      // Store user account with hash
      const user = await UserDb.register( username, email, hash );
      if ( user ) {
        res.redirect( '/users/login/?m=registered' );
      } else {
        throw new Error( 'An error occured.' );
      }
    }
  } catch ( e ) {
    console.log( e );
    res.render( 'register', {
      csrfToken: req.csrfToken && req.csrfToken(),
      email: req.body.email,
      username: req.body.username,
      password: '',
      error: e.message
    } );
  }
} );

router.get( '/welcome', function( req, res, next ) {
  res.render( 'welcome', { name: req.query.name } );
} );

module.exports = router;
