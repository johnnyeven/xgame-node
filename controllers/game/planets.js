module.exports = function(req, res, next) {
	var mongo_connect = require('../../modules/MongoConnection');
	mongo_connect(function(db) {
		var Planets = require('../../modules/Planets');
		Planets.find({
			owner: req.session.role.role_name
		}, function(err, planets) {
			var species = require('../../constants/species');
			res.render('game/planets', {
				species: species.name[req.session.role.role_species - 1],
				planets: planets
			});
			db.close();
		});
	});
};