module.exports = function(req, res, next) {
	var response = function(db, type, place) {
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
					if(type == 'station') {
						res.render('game/overview_station', {
							species: species.name[req.session.role.role_species - 1],
							place: place,
							position: position
						});
					} else {
						res.render('game/overview_planet', {
							species: species.name[req.session.role.role_species - 1],
							place: place,
							position: position
						});
					}
				});
			});
		});
	};
	var mongo_connect = require('../../modules/MongoConnection');
	mongo_connect(function(db) {
		if(db) {
			var current_place = req.session.role.current_place;
			var type = current_place.match(/[a-z]+/g)[0];
			if(type == 'station') {
				var ConstStations = require('../../modules/ConstStations');
				ConstStations.findOne({
					id: current_place
				}, function(err, station) {
					if(err) {
						err.status = 500;
						return next(err, req, res);
					}

					if(station) {
						response(db, type, station);
					} else {
						var err = {
							status: 200,
							message: "Can't find the station(id = " + current_place + ")"
						};
						return next(err, req, res);
					}
				});
			} else if(type == 'planet') {
				var Planets = require('../../modules/Planets');
				Planets.findOne({
					id: current_place
				}, function(err, planet) {
					if(err) {
						err.status = 500;
						return next(err, req, res);
					}

					if(planet) {
						response(db, type, planet);
					} else {
						var err = {
							status: 200,
							message: "Can't find the planet(id = " + current_place + ")"
						};
						return next(err, req, res);
					}
				});
			}
		} else {
			var err = {
				status: 500,
				message: 'database connections failed.'
			};
			next(err, req, res);
		}
	});
};