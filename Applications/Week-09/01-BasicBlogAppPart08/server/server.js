const express = require( 'express' );
const logger = require( 'morgan' );
const bodyParser = require( 'body-parser' );
const cookieParser = require( 'cookie-parser' );
const jwt = require( 'express-jwt' );
const atob = require( 'atob' );
const app = express();
require( 'dotenv' )
  .config();

const controllers = require( './controllers/controllers' );
const common = require( './controllers/common' );

const UserDb = require( './db/user.db' );

const insecureRoutes = [
  '/api/user/login',
  '/api/user/logout',
  '/api/user/register',
  '/api/user/forgot-password',
  '/api/user/reset-password',
  '/api/user/token'
];

//////////////////
// Server Setup
//////////////////

app.set( "env", process.env.NODE_ENV || "development" );
app.set( "host", process.env.HOST || "0.0.0.0" );
app.set( "port", process.env.PORT || 3000 );
app.disable( 'x-powered-by' );

///////////////////////
// Server Middleware
///////////////////////

app.use( logger( app.get( "env" ) === "production" ? "combined" : "dev" ) );

// parse application/json
app.use( bodyParser.json() );
app.use( cookieParser() );

// parse application/x-www-form-urlencoded
app.use( bodyParser.urlencoded( { extended: false } ) );

// CORS
// This allows client applications from other domains use the API Server
app.use( function( req, res, next ) {
  res.header( "Access-Control-Allow-Origin", "http://localhost:8080" );
  res.header( "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization" );
  res.header( "Access-Control-Allow-Methods", "GET,POST,PUT,DELETE" )
  next();
} );

// JWT Authentication
app.use( jwt( { secret: process.env.JWT_SECRET } )
  .unless( {
    path: insecureRoutes
  } )
);

app.use( async function( req, res, next ) {
  console.log( req.method )
  if ( req.method === 'OPTIONS' || isInsecurePage( req.path ) ) {
    return next();
  }
  try {
    const authHeader = req.get( 'Authorization' );
    const token = authHeader ? authHeader.split( ' ' )[ 1 ] : null;
    const tokenData = JSON.parse( atob( token.split( '.' )[ 1 ] ) );
    if ( !tokenData.id ) {
      console.log( 'Invalid ID' );
      throw new Error();
    }
    const user = await UserDb.getOne( tokenData.id );
    if ( !user || user.security_stamp !== tokenData.securityStamp ) {
      console.log( 'Invalid User' );
      console.log( user.security_stamp, tokenData.securityStamp );
      throw new Error();
    }
    req.user = user;
    next();
  } catch ( e ) {
    console.log( e );
    var err = new Error( 'Token Invalid' );
    err.name = 'UnauthorizedError';
    next( err );
  }

} );

//////////////////
// API Queries
//////////////////

app.use( '/api', controllers );

////////////////////
// Error Handlers
////////////////////
// not authenticated handler
app.use( function( err, req, res, next ) {
  if ( err.name === 'UnauthorizedError' ) {
    common.userNotAuthorized( res );
  } else {
    next();
  }
} );

// catch 404 and forward to error handler
app.use( function( req, res, next ) {
  var err = new Error( 'Not Found' );
  err.status = 404;
  next( err );
} );

// development error handler
// will print stacktrace
if ( app.get( 'env' ) === 'development' ) {
  app.use( function( err, req, res, next ) {
    res.status( err.code || 500 )
      .json( {
        status: 'error',
        message: err
      } );
  } );
}

// production error handler
// no stacktraces leaked to user
app.use( function( err, req, res, next ) {
  res.status( err.status || 500 )
    .json( {
      status: 'error',
      message: err.message
    } );
} );

/////////////////////////
// Server Begin Listening
/////////////////////////

app.listen( app.get( "port" ), function() {
  console.log( '\n' + '**********************************' );
  console.log( 'REST API listening on port ' + app.get( "port" ) );
  console.log( '**********************************' + '\n' );
} );

function isInsecurePage( loc ) {
  console.log( 'is insecure' )
  for ( let i = 0; i < insecureRoutes.length; i++ ) {
    if ( loc.indexOf( insecureRoutes[ i ] ) >= 0 ) {
      return true;
    }
  }
  return false;
}

module.exports = app;
