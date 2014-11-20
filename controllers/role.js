exports.index = function(req, res, next) {
	var Role = require('../proxy').Role;
	Role.getRoleByAccountId(req.session.user.id, function(err, role) {
		if(err) {
			return next(err, req, res);
		}
		if (role) {
			req.session.role = role;
			res.redirect('/game/overview');
		} else {
			req.session.role = null;
			res.render('create_role', {});
		}
	});
};