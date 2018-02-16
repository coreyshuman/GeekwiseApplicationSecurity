const express = require('express');
const router = express.Router();
const dbPosts = require('../db/post.db');
const Post = require('../models/post.model');

router.get('/all', async function(req, res, next) {
    try {
        let posts = await dbPosts.getAll(req.query.order, req.query.by);
        posts = posts.map((p) => { return new Post(p) });
        res.status(200).json(posts);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.get('/delete/:id', async function(req, res, next) {
    try {
        const id = req.params.id;
        let post = await dbPosts.getOne(id);
        post = new Post(post);
        if (post && post.id) {
            res.render('delete', { csrfToken: req.csrfToken && req.csrfToken(), id: id, title: post.title, post: post.post, username: post.username, postdate: post.created_at, editdate: post.updated_at });
        } else {
            throw new Error("Invalid post");
        }
    } catch (e) {
        res.render('delete', { id: id, title: '', post: '', error: e.message });
    }
});

router.post('/delete/:id', async function(req, res, next) {
    try {
        const id = req.params.id;
        let post = await dbPosts.deleteOne(id);
        res.redirect('/');
    } catch (e) {
        res.render('delete', { id: id, title: '', post: '', error: e.message });
    }
});

/* GET edit page. */
router.get('/:id', async function(req, res, next) {
    try {
        const id = req.params.id;
        let post = await dbPosts.getOne(id);
        post = new Post(post);
        if (post && post.id) {
            res.render('edit', { csrfToken: req.csrfToken && req.csrfToken(), id: id, mode: 'Edit Post', submitButton: 'Save Changes', title: post.title, post: post.post, username: post.username, postdate: post.created_at, editdate: post.updated_at });
        } else {
            res.render('edit', { csrfToken: req.csrfToken && req.csrfToken(), id: 0, mode: 'New Post', submitButton: 'Create Post', title: '', post: '', error: 'Post Not Found' });
        }
    } catch (e) {
        res.render('edit', { csrfToken: req.csrfToken && req.csrfToken(), id: id, mode: 'New Post', submitButton: 'Create Post', title: '', post: '', error: e.message });
    }
});

/* Get create page. */
router.get('/', async function(req, res, next) {
    res.render('edit', { csrfToken: req.csrfToken && req.csrfToken(), id: 0, mode: 'New Post', submitButton: 'Create Post', title: '', post: '', username: req.cookies.username });
});

/* Handle submit */
router.post('/:id', handlePost);
router.post('/', handlePost);

async function handlePost(req, res, next) {
    try {
        if (!isNaN(req.body.id) && req.body.id > 0) {
            console.log('update post')
            let post = await dbPosts.updateOne(req.body.id, req.body);
            post = new Post(post);
            res.render('edit', { csrfToken: req.csrfToken && req.csrfToken(), id: req.body.id, mode: 'Edit Post', submitButton: 'Save Changes', title: post.title, post: post.post, username: post.username, postdate: post.created_at, editdate: post.updated_at });

        } else {
            console.log('create new post');
            let post = await dbPosts.insertOne(req.body, req.user.id);
            post = new Post(post);
            //res.render('edit', { id: req.user.id, mode: 'Edit Post', submitButton: 'Save Changes', title: post.title, post: post.post, username: post.username, postdate: post.created_at, editdate: post.updated_at });
            res.redirect('/post/' + post.id);
        }
    } catch (e) {
        res.render('edit', { csrfToken: req.csrfToken && req.csrfToken(), id: req.body.id, mode: 'Edit Post', submitButton: 'Save Changes', title: req.body.title, post: req.body.post, error: e.message });
    }
}

module.exports = router;