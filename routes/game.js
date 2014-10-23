var express = require('express');
var router = express.Router();

router.get('/game/*', checkLogin);
router.get('/game', require('../controllers/game/index'));

module.exports = router;

function checkLogin(req, res, next) {
	if(!req.session.user) {
		return res.redirect('/login');
	}
	next();
}