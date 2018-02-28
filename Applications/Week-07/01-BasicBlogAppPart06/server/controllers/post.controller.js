const Post = require( '../models/post.model' );
const PostDb = require( '../db/post.db' );
const Common = require( './common' );

class PostController {
  constructor( router ) {
    router.route( '/post/search' )
      .post( this.search );
    router.route( '/post/:id' )
      .get( this.getOne )
      .put( this.updateOne )
      .delete( this.deleteOne );
    router.route( '/post' )
      .get( this.getAll )
      .post( this.insertOne );
  }

  async getOne( req, res, next ) {
    try {
      const data = await PostDb.getOne( req.params.id );
      if ( data ) {
        let post = new Post( data );
        return Common.resultOk( res, post );
      } else {
        return Common.resultNotFound( res );
      }
    } catch ( e ) {
      // handle error
      if ( e.code == 0 ) {
        return Common.resultNotFound( res );
      } else {
        return Common.resultErr( res, e.message );
      }
    }
  }

  async updateOne( req, res, next ) {
    try {
      const data = await PostDb.updateOne( req.params.id, req.body );
      if ( data ) {
        let post = new Post( data );
        return Common.resultOk( res, post );
      } else {
        return Common.resultNotFound( res );
      }
    } catch ( e ) {
      // handle error
      if ( e.code == 0 ) {
        return Common.resultNotFound( res );
      } else {
        return Common.resultErr( res, e.message );
      }
    }
  }

  async insertOne( req, res, next ) {
    try {
      const data = await PostDb.insertOne( req.body );
      if ( data ) {
        let post = new Post( data );
        return Common.resultOk( res, post );
      } else {
        return Common.resultNotFound( res );
      }
    } catch ( e ) {
      // handle error
      if ( e.code && e.code === 0 ) {
        return Common.resultNotFound( res );
      } else {
        return Common.resultErr( res, e.message );
      }
    }
  }

  async deleteOne( req, res, next ) {
    try {
      const data = await PostDb.deleteOne( req.params.id );
      if ( data ) {
        return Common.resultOk( res, data );
      } else {
        return Common.resultNotFound( res );
      }
    } catch ( e ) {
      // handle error
      if ( e.code && e.code === 0 ) {
        return Common.resultNotFound( res );
      } else {
        return Common.resultErr( res, e.message );
      }
    }
  }

  async getAll( req, res, next ) {
    try {
      const data = await PostDb.getAll();
      if ( data ) {
        const posts = data.posts.map( p => { return new Post( p ) } );
        data.posts = posts;
        return Common.resultOk( res, data );
      } else {
        return Common.resultNotFound( res );
      }
    } catch ( e ) {
      return Common.resultErr( res, e.message );
    }
  }

  async search( req, res, next ) {
    try {
      const data = await PostDb.search( req.body.search );
      if ( data ) {
        let posts = data.map( p => { return new Post( p ) } );
        return Common.resultOk( res, posts );
      } else {
        return Common.resultOk( [] );
      }
    } catch ( e ) {
      console.log( 'catch', e )
      return Common.resultErr( res, e.message );
    }
  }
}

module.exports = PostController;
