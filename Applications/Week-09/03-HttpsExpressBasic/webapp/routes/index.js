const express = require( 'express' );
const router = express.Router();

const title = 'Encryption Sandbox';
const post = 'This simple express application supports HTTPS.';

/* GET home page. */
router.get( '/', async function( req, res, next ) {
  res.render( 'index', { title: title, post: post } );
} );

module.exports = router;
