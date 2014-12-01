var app = require('../app');
var config = require('./' + app.get('env') + '/app');

module.exports = config;