var express = require( 'express' );
var path = require( 'path' );
var favicon = require( 'serve-favicon' );
var logger = require( 'morgan' );
var cookieParser = require( 'cookie-parser' );
var bodyParser = require( 'body-parser' );
var config = require( './config' )
  .ssl;

var index = require( './routes/index' );

require( 'dotenv' )
  .config();

var app = express();

// Force HTTPS redirect unless we are using localhost or unit testing with superagent.
function httpsRedirect( req, res, next ) {
  if ( req.protocol === 'https' ||
    req.header( 'X-Forwarded-Proto' ) === 'https' ||
    req.header( 'User-Agent' )
    .match( /^node-superagent/ )
    /*||
       req.hostname === 'localhost'*/
  ) {
    return next();
  }

  res.status( 301 )
    .redirect( "https://" + req.headers.host + req.url );
}

// redirect non-ssl to ssl
if ( config.redirect ) {
  app.use( httpsRedirect );
}

// view engine setup
app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'jade' );

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use( logger( 'dev' ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( cookieParser() );
app.use( express.static( path.join( __dirname, 'public' ) ) );

app.use( '/', index );

// catch 404 and forward to error handler
app.use( function( req, res, next ) {
  var err = new Error( 'Not Found' );
  err.status = 404;
  next( err );
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
