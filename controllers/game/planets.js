module.exports = function(req, res, next) {
	var Planet = require('../../proxy').Planets;
	Planet.getPlanetsByOwner(req.session.role.role_name, function(err, planets) {
		if(err) {
			return next(err, req, res);
		}
		var species = require('../../constants/species');
		res.render('game/planets', {
			species: species.name[req.session.role.role_species - 1],
			planets: planets
		});
	});
};