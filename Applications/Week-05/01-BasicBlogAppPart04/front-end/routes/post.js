const express = require('express');
const router = express.Router();
const dbPosts = require('../db/post.db');

/* GET edit page. */
router.get('/:id', async function(req, res, next) {
    try {
        const id = req.params.id;
        const post = await dbPosts.getOne(id);
        if (post && post.id) {
            res.render('edit', { id: id, mode: 'Edit Post', submitButton: 'Save Changes', title: post.title, post: post.post, username: post.username });
        } else {
            res.render('edit', { id: 0, mode: 'New Post', submitButton: 'Create Post', title: '', post: '', error: 'Post Not Found' });
        }
    } catch (e) {
        res.render('edit', { id: id, mode: 'New Post', submitButton: 'Create Post', title: '', post: '', error: e.message });
    }
});

/* Get create page. */
router.get('/', async function(req, res, next) {
    res.render('edit', { id: 0, mode: 'New Post', submitButton: 'Create Post', title: '', post: '', username: req.cookies.username });
});

/* Handle submit */
router.post('/', async function(req, res, next) {
    try {
        if (!isNaN(req.body.id) && req.body.id > 0) {
            console.log('update post')
            const post = await dbPosts.updateOne(req.body.id, req.body);
            res.render('edit', { id: req.body.id, mode: 'Edit Post', submitButton: 'Save Changes', title: post.title, post: post.post, username: post.username });

        } else {

            console.log('create new post');
            const post = await dbPosts.insertOne(req.body, req.user.id);
            res.render('edit', { id: req.user.id, mode: 'Edit Post', submitButton: 'Save Changes', title: post.title, post: post.post, username: post.username });
        }
    } catch (e) {
        res.render('edit', { id: req.body.id, mode: 'Edit Post', submitButton: 'Save Changes', title: post.title, post: post.post, username: post.username, error: e.message });
    }
});

module.exports = router;