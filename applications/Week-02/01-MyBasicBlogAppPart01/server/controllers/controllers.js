const PostController = require('./post.controller');
const express = require('express');
const router = express.Router();

const postController = new PostController(router);

module.exports = router;