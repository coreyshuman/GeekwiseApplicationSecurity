//include dependencies
var express = require( 'express' );
var serveStatic = require( 'serve-static' );
var bodyParser = require( 'body-parser' )
var cookieParser = require( 'cookie-parser' );
var mongo = require( 'mongodb' )
  .MongoClient;
var unless = require( 'express-unless' );
var session = require( 'client-sessions' );
var csurf = require( 'csurf' );

//include config file
var config = require( './server.conf' );

//create express server and register global middleware
var app = express();
app.use( bodyParser.json() ); //to support json bodies
app.use( bodyParser.urlencoded( { // to support URL-encoded bodies
  extended: true
} ) );
app.use( cookieParser() );

app.use( serveStatic( __dirname + '/public' ) ); //serve files in /public dir

//note: session stored in client-side cookie 
app.use( session( {
  cookieName: 'session',
  secret: config.sessionSecret,
  duration: 60 * 60 * 1000 * 24, //internally, cookie valid for 24 hours
  cookie: {
    httpOnly: false,
    maxAge: 1000 * 60 * 15, //cookie purged from browser after 15 minutes
  }
} ) );

//bind to interface localhost:9000
app.listen( 9000, function() {
  if ( process.env.NODE_ENV === undefined )
    process.env.NODE_ENV = 'development';
  console.log( "Server running on localhost, port %d in %s mode.", this.address()
    .port, process.env.NODE_ENV );
} );

function authenticate( user, pass, req, res ) {
  //connect to MongoDB - auth not enabled 
  //also, http interface enabled at http://localhost:28017/
  //can bypass with query selector injection (i.e., user=admin&pass[$gt]=)
  mongo.connect( 'mongodb://mongodb:27017/users', function( err, db ) {
    if ( err ) {
      console.log( 'MongoDB connection error...' );
      return err;
    }
    if ( typeof user === 'string' && typeof pass === 'string' ) {
      console.log( pass, typeof pass );
      const query = { username: user, password: pass, isActive: true };
      console.log( query );
      db.collection( 'collection' )
        .findOne( query, function( err, result ) {
          if ( err ) {
            console.log( 'Query error...' );
            return err;
          }
          if ( result !== null ) {
            req.session.authenticated = true;
            res.redirect( '/' );
          } else
            res.redirect( '/login?user=' + user );
        } );
    } else {
      console.log( pass, typeof pass );
      res.redirect( '/login?user=' + user );
    }

  } );
}

var queryMongo = function( res, database, collectionName, field, value ) {
  //connect to MongoDB - auth not enabled 
  //also, http interface enabled at http://localhost:28017/
  mongo.connect( 'mongodb://mongodb:27017/' + database, function( err, db ) {
    if ( err ) {
      console.log( 'MongoDB connection error...' );
      return err;
    }

    //search query
    var query = {}

    //set key:value pair dynamically - user can define key!
    query[ field ] = value;
    console.log( query )

    //query db
    db.collection( collectionName )
      .find( query )
      .toArray( function( err, result ) {
        if ( err ) {
          console.log( 'Query error...' );
          return err;
        }
        //return array of objects matching query
        res.send( result );
      } );
  } );
}

//If logged in, continue; else, redirect to index page
var isLoggedIn = function( req, res, next ) {
  if ( req.session.authenticated )
    next();
  else
    res.redirect( '/login' );
}

//add express-unless to isLoggedIn
isLoggedIn.unless = unless;

//apply isLoggedIn to all routes beginning with /secure
//uses negative regex to exclude routes that don't begin with /secure
app.use( isLoggedIn.unless( { path: /^(?!\/secure).*/i } ) );

//routes
//isLoggedIn middleware applied directly to route
app.get( '/', isLoggedIn, function( req, res ) {
  res.sendFile( './index.html', { root: __dirname } )
} );

app.get( '/about', function( req, res ) {
  //the file ./about.html does not exist. Will return path to requested file in dev mode.
  res.sendFile( './about.html', { root: __dirname } )
} );

app.get( '/secure/invoices', function( req, res ) {
  res.sendFile( './invoices.html', { root: __dirname } ) //use vanilla HTML
} );

app.get( '/secure/manageInvoices', function( req, res ) {
  res.sendFile( './manageInvoices.html', { root: __dirname } ) //use vanilla HTML
} );

app.get( '/logout', function( req, res ) {
  res.cookie( 'session', null ); //tell browser to set session as null to 'invalidate' session
  res.redirect( '/login' );
} );

app.get( '/login', function( req, res ) {
  res.sendFile( './login.html', { root: __dirname } )
} );

app.post( '/login', function( req, res ) {
  authenticate( req.body.user, req.body.pass, req, res );
} );

app.post( '/secure/query', function( req, res ) {
  queryMongo( res, 'billing', 'invoices', req.body.field, req.body.value );
} );

//use csurf middleware to protect against csurf attacks - does not apply to GET requests unless ignoreMethods option is used 
app.use( csurf( {
  cookie: true,
} ) );

//set XSRF-TOKEN cookie for each request
app.use( function( req, res, next ) {
  res.cookie( 'XSRF-TOKEN', req.csrfToken() );
  next();
} );

//error handler for csurf middleware
app.use( function( err, req, res, next ) {
  if ( err.code !== 'EBADCSRFTOKEN' ) return next( err );
  //handle CSRF token errors here 
  console.log( 'CSRF blocked' )
  res.status( 403 )
  res.send( 'form tampered with' )
} );

app.use( function( err, req, res, next ) {
  console.log( err )
} );

//remove invoice
app.post( '/secure/removeInvoice', function( req, res ) {
  //connect to MongoDB - auth not enabled 
  //also, http interface enabled at http://localhost:28017/
  mongo.connect( 'mongodb://mongodb:27017/billing', function( err, db ) {
    if ( err ) {
      console.log( err );
      res.status( 500 )
        .send( 'Could not connect to database...' );
      return;
    }
    let query = { id: req.body.value };
    console.log( 'delete', query );
    db.collection( 'invoices' )
      .remove( query, function( err, record ) {
        if ( err ) {
          console.log( err );
          //XSS vector if not sanitized by $sce and used in html context via ng-bind-html
          res.status( 500 )
            .send( 'Could not remove invoice where id = ' + req.body.value );
          return;
        }
        var numRemoved = JSON.parse( record )
          .n;
        if ( numRemoved > 0 )
          //XSS vector if not sanitized by $sce and used in html context via ng-bind-html
          res.send( 'Successfully removed ' + numRemoved + ' invoice where id = ' + req.body.value );
        else
          res.send( 'Unable to locate invoice where id = ' + req.body.value );
      } );
  } );
} );

//add invoice
app.post( '/secure/addInvoice', function( req, res ) {
  //build invoice	- inputs are not validated and invoice object is open to parameter pollution
  const invoice = {
    ccn: null,
    fName: null,
    id: null,
    item: null,
    lName: null,
    paid: null,
    price: null,
    quantity: null
  };
  const data = req.body;

  for ( var key in invoice ) {
    if ( invoice.hasOwnProperty( key ) && typeof data[ key ] === 'string' ) {
      invoice[ key ] = data[ key ];
    }
  }
  console.log( invoice );

  //connect to MongoDB - auth not enabled 
  //also, http interface enabled at http://localhost:28017/
  mongo.connect( 'mongodb://mongodb:27017/billing', function( err, db ) {
    if ( err ) {
      console.log( err );
      res.status( 500 )
        .send( 'Could not add invoice...' );
      return;
    }
    db.collection( 'invoices' )
      .insert( invoice, function( err, record ) {
        if ( err ) {
          console.log( err );
          res.status( 500 )
            .send( 'Could not add invoice...' );
          return;
        }
        console.log( 'Added invoice: %s', JSON.stringify( record ) );
        res.send( 'Invoice added successfully...' );
      } );
  } );
} );
