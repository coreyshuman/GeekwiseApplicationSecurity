const express = require( 'express' );
const path = require( 'path' );
const favicon = require( 'serve-favicon' );
const logger = require( 'morgan' );
const cookieParser = require( 'cookie-parser' );
const cookieSession = require( 'cookie-session' );
const bodyParser = require( 'body-parser' );
const csrf = require( 'csurf' );
const index = require( './routes/index' );
const users = require( './routes/users' );
const post = require( './routes/post' );
const octicons = require( 'octicons' );
require( 'dotenv' )
  .config();

const app = express();

// view engine setup
app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'jade' );

app.use( favicon( path.join( __dirname, 'public', 'favicon.ico' ) ) );
app.use( logger( 'dev' ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( cookieParser() );
app.use( express.static( path.join( __dirname, 'public' ) ) );
app.use( '/icons', express.static( path.join( __dirname, 'node_modules/octicons/build/svg' ) ) );
app.use( cookieSession( {
  name: 'session',
  secret: process.env.COOKIE_SECRET,
  httpOnly: false,
  // Cookie Options
  maxAge: 60 * 60 * 1000 // 1 hour
} ) );

// check user cookie
app.use( function( req, res, next ) {
  const user = req.session.user;
  if ( true ) { // set to true to use server-side redirect
    if ( !user && ( !isInsecurePage( req.path ) ) ) {
      console.log( 'not auth - redirect' );
      req.session = null;
      res.redirect( '/users/login' );
    } else {
      req.user = user;
      next();
    }
  } else {
    next();
  }
} );

// validate csrf (this must come before routes)
app.use( csrf( { cookie: true } ) );

// routes
app.use( '/', index );
app.use( '/users', users );
app.use( '/post', post );

// catch 404 and forward to error handler
app.use( function( req, res, next ) {
  var err = new Error( 'Not Found' );
  err.status = 404;
  next( err );
} );

// CSRF error handler
app.use( function( err, req, res, next ) {
  if ( err.code !== 'EBADCSRFTOKEN' ) return next( err )

  // handle CSRF token errors here
  res.redirect( '/error/403' );
} );

// error handler
app.use( function( err, req, res, next ) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get( 'env' ) === 'development' ? err : {};

  // render the error page
  res.status( err.status || 500 );
  res.render( 'error' );
} );

module.exports = app;

function isInsecurePage( loc ) {
  console.log( loc )
  const insecure = [
      '/users/login',
      '/users/logout',
      '/users/register',
      '/error/'
    ];
  for ( let i = 0; i < insecure.length; i++ ) {
    if ( loc.indexOf( insecure[ i ] ) >= 0 ) {
      return true;
    }
  }
  return false;
}
