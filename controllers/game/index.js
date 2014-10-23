module.exports = function(req, res, next) {
	if(req.session.user) {
		res.render('platform', {});
	} else {
		res.redirect('/login');
	}
};