var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { title: 'Express' });
});
router.get('/login', function(req, res) {
	res.render('login', {});
});
router.get('/register', function(req, res) {
	res.render('register', {});
});
router.post('/login', require('../controllers/login'));
router.post('/register', require('../controllers/register'));

router.all('/role', checkLogin);
router.get('/role', require('../controllers/role'));
router.post('/role', require('../controllers/create_role'));

module.exports = router;

function checkLogin(req, res, next) {
	if(!req.session.user) {
		return res.redirect('/login');
	}
	next();
}
