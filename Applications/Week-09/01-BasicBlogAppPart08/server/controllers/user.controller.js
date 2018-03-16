const User = require( '../models/user.model' );
const UserDb = require( '../db/user.db' );
const RolesDb = require( '../db/roles.db' );
const PermissionDb = require( '../db/permissions.db' );
const TokenStoreDb = require( '../db/tokenStore.db' );
const Common = require( './common' );
const bcrypt = require( 'bcryptjs' );
const crypto = require( 'crypto' );
const jwt = require( 'jsonwebtoken' );

const SALT_ROUNDS = parseInt( process.env.SALT_ROUNDS );
const STAMP_ROUNDS = 8;

const LOGIN_FAIL = 'Email or Password was incorrect.';
const FORGOT_PASS = 'An email was sent to you.';
const INVALID_RESET_TOKEN = 'Your reset token is invalid or expired.';
const UPDATED_PASS = 'Your password has been updated.';

class UserController {
  constructor( router ) {
    router.route( '/user/search' )
      .post( this.search );
    router.route( '/user/token' )
      .post( UserController.allowCredentials, UserController.verifyRefreshToken, this.token )
      .options( UserController.allowCredentials )
    router.route( '/user/:id' )
      .get( this.getOne )
      .put( this.updateOne )
      .delete( this.deleteOne );
    router.route( '/user' )
      .get( this.getAll )
      .post( this.insertOne );
    router.route( '/user/login' )
      .options( UserController.allowCredentials )
      .post( UserController.allowCredentials, this.login );
    router.route( '/user/register' )
      .post( this.register );
    router.route( '/user/forgot-password' )
      .post( this.forgotPassword );
    router.route( '/user/reset-password' )
      .post( this.resetPassword );

    router.route( '/user/change-password' )
      .post( this.changePassword );
  }

  async login( req, res, next ) {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const data = await UserDb.getByEmail( email );
      if ( data ) {
        const result = await bcrypt.compare( password, data.password );
        if ( result ) {
          const user = new User( data );
          const accessToken = await UserController.generateAccessToken( data );
          const refreshToken = await UserController.generateRefreshToken( data );
          UserController.setRefreshTokenCookie( res, refreshToken );
          return Common.resultOk( res, { refreshToken: refreshToken, accessToken: accessToken, user: user } );
        } else {
          return Common.resultNotFound( res, LOGIN_FAIL );
        }
      } else {
        // in debug mode we could say user doesn't exist here
        // calculate hash to create a delay (don't leak fact that user doesn't exist)
        const hash = await bcrypt.hash( password, SALT_ROUNDS );
        return Common.resultNotFound( res, LOGIN_FAIL );
      }
    } catch ( e ) {
      // handle error
      return Common.resultErr( res, e.message );
    }
  }

  static allowCredentials( req, res, next ) {
    res.header( "Access-Control-Allow-Credentials", "true" );
    next();
  }

  async token( req, res, next ) {
    try {
      const accessToken = await UserController.generateAccessToken( req.user );
      return Common.resultOk( res, { accessToken: accessToken } );
    } catch ( e ) {
      return Common.resultErr( res, e.message );
    }
  }

  async register( req, res, next ) {
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
        return Common.userAlreadyExists( res );
      } else {
        // calculate hash
        const hash = await bcrypt.hash( password, SALT_ROUNDS );
        // Store user account with hash
        const user = await UserDb.register( username, email, hash, secstamp );
        // generate security stamp
        await UserController.updateSecurityStamp( user );
        if ( user ) {
          Common.resultOk( res, new User( user ) );
        } else {
          Common.resultErr( res );
        }
      }
    } catch ( e ) {
      // handle error
      return Common.resultErr( res, e.message );
    }
  }

  async forgotPassword( req, res, next ) {
    try {
      const email = req.body.email;
      const data = await UserDb.getByEmail( email );
      if ( data ) {
        const user = new User( data );
        const tokenData = JSON.stringify( { email: user.email, password: user.password } );
        const token = await bcrypt.hash( tokenData, STAMP_ROUNDS );
        await UserDb.updateForgotPasswordToken( user.id, secstamp );
        // need to send email here
        const email = process.env.NODE_ENV + token;
        console.log( email );
        return Common.resultOk( res, FORGOT_PASS );
      } else {
        return Common.resultOk( res, FORGOT_PASS );
      }
    } catch ( e ) {
      // handle error
      const secstamp = await bcrypt.hash( { thisis: 'fakedata' }, STAMP_ROUNDS );
      return Common.resultErr( res, e.message );
    }
  }

  async resetPassword( req, res, next ) {
    try {
      const email = req.body.email;
      const token = req.body.token;
      const password = req.body.password;
      const data = await UserDb.getByEmail( email );
      if ( data ) {
        if ( data.forgot_password_token !== token || !data.forgot_password_timestamp || Date.now() - Date.parse(
            data.forgot_password_timestamp ) > 15 * 60 * 1000 ) {
          return Common.resultErr( res, INVALID_RESET_TOKEN );
        } else {
          await UserController.updatePassword( data, password );
          return Common.resultOk( res, UPDATED_PASS );
        }
      } else {
        return Common.resultErr( res, INVALID_RESET_TOKEN );
      }
    } catch ( e ) {
      return Common.resultErr( res, INVALID_RESET_TOKEN );
    }
  }

  async changePassword( req, res, next ) {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const newPass = req.body.newPassword;
      const data = await UserDb.getByEmail( email );
      if ( data ) {
        const result = await bcrypt.compare( password, data.password );
        if ( result ) {
          await updatePassword( data, password );
          // return new tokens
          const accessToken = await UserController.generateAccessToken( data );
          const refreshToken = await UserController.generateRefreshToken( data );
          return Common.resultOk( res, { refreshToken: refreshToken, accessToken: accessToken } );
        } else {
          return Common.resultNotFound( res, LOGIN_FAIL );
        }
      } else {
        // in debug mode we could say user doesn't exist here
        // calculate hash to create a delay (don't leak fact that user doesn't exist)
        const hash = await bcrypt.hash( password, SALT_ROUNDS );
        return Common.resultNotFound( res, LOGIN_FAIL );
      }
    } catch ( e ) {
      // handle error
      return Common.resultErr( res, e.message );
    }
  }

  async getOne( req, res, next ) {
    try {
      const data = await UserDb.getOne( req.params.id );
      if ( data ) {
        const user = new User( data );
        return Common.resultOk( res, user );
      } else {
        return Common.resultNotFound( res );
      }
    } catch ( e ) {
      // handle error
      return Common.resultErr( res, e.message );
    }
  }

  async updateOne( req, res, next ) {
    try {
      const data = await UserDb.updateOne( req.params.id, req.body );
      if ( data ) {
        const user = new User( data );
        return Common.resultOk( res, user );
      } else {
        return Common.resultNotFound( res );
      }
    } catch ( e ) {
      // handle error
      return Common.resultErr( res, e.message );
    }
  }

  async insertOne( req, res, next ) {
    try {
      const data = await UserDb.insertOne( req.body );
      if ( data ) {
        const user = new User( data );
        return Common.resultOk( res, user );
      } else {
        return Common.resultNotFound( res );
      }
    } catch ( e ) {
      // handle error
      return Common.resultErr( res, e.message );
    }
  }

  async deleteOne( req, res, next ) {
    try {
      const data = await UserDb.deleteOne( req.params.id );
      if ( data ) {
        return Common.resultOk( res, data );
      } else {
        return Common.resultNotFound( res );
      }
    } catch ( e ) {
      // handle error
      return Common.resultErr( res, e.message );
    }
  }

  async getAll( req, res, next ) {
    try {
      const data = await UserDb.getAll();
      if ( data ) {
        const users = data.map( p => { return new User( p ) } );
        return Common.resultOk( res, users );
      } else {
        return Common.resultNotFound( res );
      }
    } catch ( e ) {
      return Common.resultErr( res, e.message );
    }
  }

  async search( req, res, next ) {
    try {
      const data = await UserDb.search( req.body.search );
      if ( data ) {
        const users = data.map( p => { return new User( p ) } );
        return Common.resultOk( res, users );
      } else {
        return Common.resultOk( [] );
      }
    } catch ( e ) {
      console.log( 'catch', e )
      return Common.resultErr( res, e.message );
    }
  }

  /********* Util Functions **************/
  static async verifyRefreshToken( req, res, next ) {
    try {
      const refreshToken = req.cookies.refreshToken;
      const userId = refreshToken.split( '.' )[ 0 ];
      if ( !req.user ) {
        req.user = await UserDb.getOne( userId );
      }
      const tokenEntry = await TokenStoreDb.getForUser( userId, req.user.security_stamp, refreshToken );
      if ( tokenEntry ) {
        next();
      } else {
        throw new Error();
      }
    } catch ( e ) {
      console.log( e );
      const err = new Error( 'Invalid Refresh Token' );
      err.name = 'UnauthorizedError';
      next( err );
    }
  }

  static async generateRefreshToken( user ) {
    const refreshToken = user.id.toString() + '.' + crypto.randomBytes( 40 )
      .toString( 'hex' );
    await TokenStoreDb.insertForUser( user.id, user.security_stamp, refreshToken );
    return refreshToken;
  }

  static async generateAccessToken( user ) {
    const rolesPermissions = await UserController.getUserRolesPermissions( user );
    return new Promise( ( resolve, reject ) => {
      jwt.sign( {
          id: user.id,
          username: user.username,
          access: rolesPermissions,
          securityStamp: user.security_stamp
        },
        process.env.JWT_SECRET, { expiresIn: '30m' },
        ( err, token ) => {
          if ( err ) return reject( err );
          resolve( token );
        }
      );
    } );
  }

  static async getUserRolesPermissions( user ) {
    const roles = await RolesDb.getForUser( user.id );
    const permissions = await PermissionDb.getForUser( user.id );
    return { roles: roles, permission: permissions };
  }

  static async updateSecurityStamp( user ) {
    // calculate security stamp
    const stampData = JSON.stringify( { email: user.email, password: user.password } );
    const secstamp = await bcrypt.hash( stampData, STAMP_ROUNDS );
    await UserDb.updateSecurityStamp( user.id, secstamp );
    await TokenStoreDb.deleteForUser( user.id );
  }

  static async updatePassword( user, password ) {
    // update password
    const hash = await bcrypt.hash( password, SALT_ROUNDS );
    await UserDb.updatePassword( user.id, hash );
    await UserDb.updateForgotPasswordToken( user.id, null );
    await UserController.updateSecurityStamp( user );
  }

  static setRefreshTokenCookie( res, refreshToken ) {
    res.cookie( 'refreshToken', refreshToken, {
      maxAge: 3600 * 24 * 90 * 1000, // 180 days
      httpOnly: true,
      domain: `localhost`, // todo - make this honor env settings
      path: '/api/user/token'
    } );
  }

  static clearRefreshTokenCookie( res ) {
    res.cookie( 'refreshToken', '', {
      maxAge: -1,
      httpOnly: true,
      path: '/api/user/token'
    } );
  }
}

module.exports = UserController;
