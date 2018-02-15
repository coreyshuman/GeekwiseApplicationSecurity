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

router.get('/error/:code', function(req, res, next) {
    if (req.params.code) {
        let message = "We don't know what happend. Please try again.";
        switch (req.params.code) {
            case '403':
                message = "You are not authorized to perform that action.";
        }
        res.render('error', { message: message });
    } else {
        res.render('error', { message: "We don't know what happend. Please try again." });
    }
});

module.exports = router;