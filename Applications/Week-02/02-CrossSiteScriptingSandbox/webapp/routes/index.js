var express = require('express');
var router = express.Router();
var db = require("../db/db");

/* GET home page. */
router.get('/', async function(req, res, next) {
    // todo - should try-catch here
    let data = await db.get();
    if (data) {
        console.log(data);
        res.render('index', Object.assign({ title: 'XSS Sandbox' }, data));
    } else {
        console.log("no data");
        res.render('index', { title: 'XSS Sandbox', content: 'Hello World', attribute: 'bold', css: 'gray', javascript: 'console.log("hello")' });
    }

});

router.post('/', async function(req, res, next) {
    // todo - should try-catch here
    console.log("save", req.body);
    try {
        let data = await db.upsert(req.body);
        if (data) {
            console.log(data);
            res.render('index', Object.assign({ title: 'XSS Sandbox' }, data));
        } else {
            console.log("no data");
            res.render('index', { title: 'XSS Sandbox', content: 'Hello World', attribute: 'bold', css: 'gray', javascript: 'console.log("hello")' });
        }
    } catch (e) {
        console.log(e);
    }

});

module.exports = router;