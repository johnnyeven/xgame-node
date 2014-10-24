module.exports = function(req, res, next) {
	var mongo_connect = require('../modules/MongoConnection');
	var Role = require('../modules/Role');
	mongo_connect(function(db) {
		if(db) {
			res.render('create_role', {});
		} else {
			var err = {
				message: "database connections failed.",
				status: 500
			};
			next(err, req, res);
		}
	});
};