var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
    res.render('index', {});
});

router.post('/', async function(req, res, next) {
    // todo - should try-catch here
    console.log("save", req.body);
    res.render('index', {});
});

module.exports = router;