var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('session-mongoose')({session: session});
var config = require('./config');

var app = express();

// enviroment
// app.set('env', 'production');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(compression({
    threshold: 512
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: config.cookieSecret,
    sotre: new MongoStore({
        url: "mongodb://" + config.game_db.ip + "/" + config.game_db.database,
        interval: 120000
    })
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.locals.user = req.session.user;
    res.locals.role = req.session.role;
    res.locals.time = new Date().getTime();
    next();
});

app.use(require('./routes/index'));
app.use(require('./routes/game'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
