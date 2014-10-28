module.exports = function(req, res, next) {
	var mongo_connect = require('../modules/MongoConnection');
	var Role = require('../modules/Role');
	mongo_connect(function(db) {
		if(db) {
			Role.findOne({
				account_id: req.session.user.id
			}, function(err, role) {
				db.close();
				if(err) {
					err.status = 500;
					return next(err, req, res);
				}
				if(role) {
					req.session.role = role;
					res.redirect('/game/overview');
				} else {
					req.session.role = null;
					res.render('create_role', {});
				}
			});
		} else {
			var err = {
				message: "database connections failed.",
				status: 500
			};
			next(err, req, res);
		}
	});
};