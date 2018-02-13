const express = require('express');
const router = express.Router();
const UserDb = require('../db/user.db');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 15;

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/login', function(req, res, next) {
    res.render('login', {});
});

router.post('/login', function(req, res, next) {
    res.render('login', {});
});

router.get('/logout', function(req, res, next) {
    res.render('logout', {});
});

router.get('/register', async function(req, res, next) {
    res.render('register', { email: '', username: '' });
});

router.post('/register', async function(req, res, next) {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const username = req.body.username;
        // check if username is available
        const data = await UserDb.getByEmail(email);
        if (data) {
            // user already exists
            // calculate hash anyway to create a delay (discourage email snooping)
            const hash = await bcrypt.hash(password, SALT_ROUNDS);
            throw new Error("User already exists.");
        } else {
            // calculate hash
            const hash = await bcrypt.hash(password, SALT_ROUNDS);
            // Store user account with hash
            const user = await UserDb.register(username, email, hash);
            if (user) {
                res.redirect('/login');
            } else {
                throw new Error('An error occured.');
            }
        }
    } catch (e) {
        console.log(e);
        res.render('register', { email: req.body.email, username: req.body.username, password: '', error: e.message });
    }
});

router.get('/welcome', function(req, res, next) {
    res.render('welcome', { name: req.query.name });
});

module.exports = router;