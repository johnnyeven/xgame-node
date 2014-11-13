var express = require('express');
var router = express.Router();

//params

//routes
router.all('/game/*', checkLogin);
router.all('/game/*', checkRole);
router.get('/game/overview', require('../controllers/game/overview'));
router.get('/game/planets', require('../controllers/game/planets'));
router.get('/game/planet/:planet_id', require('../controllers/game/planet'));
//Ajax
router.post('/game/planet/:planet_id/:building_id', require('../controllers/game/get_building_on_planet'));
router.post('/game/planet/:planet_id/build', require('../controllers/game/build_building_on_planet'));

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
			if(!db) {
				var err = {
					status: 500,
					message: 'Database error.'
				};
				return next(err, req, res);
			}
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