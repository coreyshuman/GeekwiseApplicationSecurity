const express = require( 'express' );
const logger = require( 'morgan' );
const bodyParser = require( 'body-parser' );
const jwt = require( 'express-jwt' );
const app = express();
require( 'dotenv' )
  .config();

const controllers = require( './controllers/controllers' );
const common = require( './controllers/common' );

//////////////////
// Server Setup
//////////////////

app.set( "env", process.env.NODE_ENV || "development" );
app.set( "host", process.env.HOST || "0.0.0.0" );
app.set( "port", process.env.PORT || 3000 );

///////////////////////
// Server Middleware
///////////////////////

app.use( logger( app.get( "env" ) === "production" ? "combined" : "dev" ) );

// parse application/json
app.use( bodyParser.json() );

// parse application/x-www-form-urlencoded
app.use( bodyParser.urlencoded( { extended: false } ) );

// CORS
// This allows client applications from other domains use the API Server
app.use( function( req, res, next ) {
  res.header( "Access-Control-Allow-Origin", "*" );
  res.header( "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization" );
  res.header( "Access-Control-Allow-Methods", "GET,POST,PUT,DELETE" )
  next();
} );

// JWT Authentication
app.use( jwt( { secret: process.env.JWT_SECRET } )
  .unless( {
    path: [ '/api/user/login',
    '/api/user/logout',
    '/api/user/register' ]
  } )
);

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

module.exports = app;
