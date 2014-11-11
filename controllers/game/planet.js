module.exports = function(req, res, next) {
	var response = function(db, place) {
		var ConstPosition1 = require('../../modules/ConstPosition1');
		ConstPosition1.findOne({
			id: place.position.x,
		}, function(err, doc1) {
			if(err) {
				err.status = 500;
				return next(err, req, res);
			}
			var ConstPosition2 = require('../../modules/ConstPosition2');
			ConstPosition2.findOne({
				id: place.position.y,
			}, function(err, doc2) {
				if(err) {
					err.status = 500;
					return next(err, req, res);
				}
				var ConstPosition3 = require('../../modules/ConstPosition3');
				ConstPosition3.findOne({
					id: place.position.z,
				}, function(err, doc3) {
					if(err) {
						err.status = 500;
						return next(err, req, res);
					}
					db.close();

					var position = {
						x: doc1.name,
						y: doc2.name,
						z: doc3.name,
						index: place.position.index
					};
					var species = require('../../constants/species');
					var buildings = require('../../constants/buildings');
					res.render('game/planet', {
						species: species.name[req.session.role.role_species - 1],
						buildings: buildings,
						planet: place,
						position: position
					});
				});
			});
		});
	};

	res.locals.find_buildings_by_id = require('../../helpers/building_helper').find_buildings_by_id;
	var mongo_connect = require('../../modules/MongoConnection');
	mongo_connect(function(db) {
		var Planets = require('../../modules/Planets');
		Planets.findOne({
			id: req.params.planet_id
		}, function(err, planet) {
			response(db, planet);
		});
	});
};