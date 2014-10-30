module.exports = function(req, res, next) {
	var response = function(type, place) {
		var species = ['艾尔', '加特里', '迪里米克'];
		if(type == 'station') {
			res.render('game/overview', {
				species: species[req.session.role.role_species - 1],
				place: place
			});
			console.log(place);
		}
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
					db.close();

					if(err) {
						err.status = 500;
						return next(err, req, res);
					}

					if(station) {
						response(type, station);
					} else {
						var err = {
							status: 200,
							message: "Can't find the station(id = " + current_place + ")"
						};
						return next(err, req, res);
					}
				});
			} else if(type == 'planet') {

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