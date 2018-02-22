var express = require( 'express' );
var router = express.Router();

// home page insecure
router.get( '/', async function( req, res, next ) {
  res.render( 'index' );
} );

// home page secure
router.get( '/csp', async function( req, res, next ) {
  res.header( 'Content-Security-Policy',
    `child-src 'self'; report-uri /error` );
  res.render( 'index' );
} );

// error handler
router.post( '/error', async function( req, res, next ) {
  // print error in magenta.
  console.log( '\x1b[35m%s\x1b[0m', JSON.stringify( req.body ) );
  res.status( 200 )
    .send( 'ok' );
} );

module.exports = router;
