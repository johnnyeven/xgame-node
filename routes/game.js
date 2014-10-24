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
	}
	next();
}