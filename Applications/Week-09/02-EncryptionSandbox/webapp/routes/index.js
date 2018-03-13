const express = require( 'express' );
const router = express.Router();
const db = require( '../db/db' );
const crypto = require( 'crypto' );

const ENCRYPTKEY = crypto.pbkdf2Sync( process.env.ENCRYPTION_PASSWORD, '*somerandomsalt*', 10000, 32, 'sha512' );
const TITLE = 'Encryption Sandbox';
const DEFAULT = {
  title: TITLE,
  data1: 'Hello World',
  data2: 'ABC 123',
  data3: 'Security is key.',
  data4: 'Protect your data!'
};

/* GET home page. */
router.get( '/', async function( req, res, next ) {
  // todo - should try-catch here
  const data = await db.get();
  if ( data ) {
    console.log( data );
    res.render( 'index', getDecodedData( data ) );
  } else {
    console.log( "no data - use default" );
    res.render( 'index', DEFAULT );
  }

} );

router.post( '/', async function( req, res, next ) {
  // todo - should try-catch here
  console.log( "save", req.body );
  const data = req.body;
  try {
    // encrypt data
    data.data1 = encryptAesCtr( data.data1 );
    data.data2 = encryptAesCtr( data.data2 );
    data.data3 = encryptAesGcm( '1', data.data3 );
    data.data4 = encryptAesGcm( '2', data.data4 );
    const resp = await db.upsert( data );
    if ( resp ) {
      console.log( resp );
      res.render( 'index', getDecodedData( resp ) );
    } else {
      console.log( "no data - use default" );
      res.render( 'index', DEFAULT );
    }
  } catch ( e ) {
    console.log( e );
    res.render( 'index', DEFAULT );
  }

} );

function getDecodedData( data ) {
  data.data1Encrypted = data.data1;
  data.data2Encrypted = data.data2;
  data.data3Encrypted = data.data3;
  data.data4Encrypted = data.data4;
  // decode data
  data.data1 = decryptAesCtr( data.data1 );
  data.data2 = decryptAesCtr( data.data2 );
  data.data3 = decryptAesGcm( '1', data.data3 );
  data.data4 = decryptAesGcm( '2', data.data4 );
  return Object.assign( { title: TITLE }, data );
}

function encryptAesCtr( data ) {
  /* Using AES CTR without an initialization vector will allow an attacker
   * to determine relationships in data that matches between users / fields 
   * because strings will be ecrypted to the same value each time. */
  //const cipher = crypto.createCipher( 'aes-256-ctr', ENCRYPTKEY );
  const iv = crypto.randomBytes( 16 );
  const cipher = crypto.createCipheriv( 'aes-256-ctr', ENCRYPTKEY, iv );
  var crypted = cipher.update( data, 'utf8', 'hex' );
  crypted += cipher.final( 'hex' );
  crypted = iv.toString( 'hex' ) + crypted;
  return crypted;
}

function decryptAesCtr( data ) {
  try {
    /* AES CTS without initialization vector is ineffective (see above comment) */
    //const decipher = crypto.createDecipheriv( 'aes-256-ctr', ENCRYPTKEY);
    const iv = Buffer.from( data.substring( 0, 32 ), 'hex' );
    const decipher = crypto.createDecipheriv( 'aes-256-ctr', ENCRYPTKEY, iv );
    var dec = decipher.update( data.substring( 32 ), 'hex', 'utf8' );
    dec += decipher.final( 'utf8' );
    return dec;
  } catch ( e ) {
    console.log( e );
    return '';
  }
}

function encryptAesGcm( id, data ) {
  const iv = crypto.randomBytes( 16 );
  const cipher = crypto.createCipheriv( 'aes-256-gcm', ENCRYPTKEY, iv );
  cipher.setAAD( Buffer.from( id ) );
  var crypted = cipher.update( data, 'utf8', 'hex' );
  crypted += cipher.final( 'hex' );
  // get message authentication code (MAC)
  const tag = cipher.getAuthTag();
  crypted = iv.toString( 'hex' ) + tag.toString( 'hex' ) + crypted;
  return crypted;
}

function decryptAesGcm( id, data ) {
  try {
    const iv = Buffer.from( data.substring( 0, 32 ), 'hex' );
    const decipher = crypto.createDecipheriv( 'aes-256-gcm', ENCRYPTKEY, iv );
    // set message authentication code (MAC)
    const tag = Buffer.from( data.substring( 32, 64 ), 'hex' );
    decipher.setAuthTag( tag );
    decipher.setAAD( Buffer.from( id ) );
    var dec = decipher.update( data.substring( 64 ), 'hex', 'utf8' );
    dec += decipher.final( 'utf8' );
    return dec;
  } catch ( e ) {
    console.log( e );
    return '';
  }
}

module.exports = router;
