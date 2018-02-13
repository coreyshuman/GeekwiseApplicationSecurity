var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
    const order = req.query.order;
    const by = req.query.by;
    res.render('index', { order: order ? order : 'Descending', orderBy: by ? by : 'Created' });
});

router.post('/', async function(req, res, next) {
    // todo - should try-catch here
    console.log("save", req.body);
    res.render('index', {});
});

module.exports = router;