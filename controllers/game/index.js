module.exports = function(req, res, next) {
	if(req.session.user) {
		res.render('game/index', {});
	} else {
		res.redirect('/login');
	}
};