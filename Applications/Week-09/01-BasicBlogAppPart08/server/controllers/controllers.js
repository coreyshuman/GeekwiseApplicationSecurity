const PostController = require( './post.controller' );
const UserController = require( './user.controller' );
const express = require( 'express' );
const router = express.Router();

const postController = new PostController( router );
const userController = new UserController( router );

module.exports = router;
