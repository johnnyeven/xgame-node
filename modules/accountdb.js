var config = require('../config');
var mysql = require('mysql');
var connection = mysql.createConnection({
	host: config.account_db.ip,
	user: config.account_db.user,
	password: config.account_db.password,
	database: config.account_db.database
});

module.exports = connection;