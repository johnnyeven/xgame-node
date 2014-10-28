module.exports = function(callback) {
	var config = require('../config');
	var mongoose = require('mongoose');
	mongoose.connect('mongodb://' + config.game_db.ip + '/' + config.game_db.database);
	var db = mongoose.connection;
	db.on('error', function() {
		callback(null);
	});
	db.once('open', function() {
		callback(db);
	});
};