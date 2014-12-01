var express = require('express');
var path = require('path');
var app = express();
module.exports = app;

// enviroment
// app.set('env', 'production');
app.set('env', 'development');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var config = require('./config/' + app.get('env') + '/app');

require('./modules');