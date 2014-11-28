exports.index = function(req, res, next) {
	var Planet = require('../../proxy').Planets;
	Planet.getPlanetsByOwner(req.session.role.role_name, function(err, planets) {
		if(err) {
			return next(err, req, res);
		}
		res.render('game/planets', {
			planets: planets
		});
	});
};