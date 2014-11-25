var express = require('express');
var router = express.Router();

//params
var overview = require('../controllers/game/overview');
var planet = require('../controllers/game/planet');
var planets = require('../controllers/game/planets');

//routes
router.all('/game/*', checkLogin);
router.all('/game/*', checkRole);
router.get('/game/overview', overview.index);
router.get('/game/planets', planets.index);
router.get('/game/planet/:planet_id', planet.index);
//Ajax
router.post('/game/planet/:planet_id/build', planet.build_building_on_planet);
router.post('/game/planet/:planet_id/:building_id', planet.get_building_on_planet);

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
		var Role = require('../proxy').Role;
		Role.getRoleByAccountId(req.session.user.id, function(err, role) {
			if(err) {
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
	}
}