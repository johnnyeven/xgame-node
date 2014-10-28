var express = require('express');
var router = express.Router();

router.all('/game/*', checkLogin);
router.all('/game/*', checkRole);
router.get('/game/overview', require('../controllers/game/overview'));

module.exports = router;

function checkLogin(req, res, next) {
	if(!req.session.user) {
		return res.redirect('/login');
	}
	next();
}

function checkRole(req, res, next) {
	if(!req.session.role) {
		return res.redirect('/role');
	} else {
		var mongo_connect = require('../modules/MongoConnection');
		var Role = require('../modules/Role');
		mongo_connect(function(db) {
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
				} else {
					req.session.role = null;
					return res.redirect('/role');
				}
				next();
			});
		});
	}
}