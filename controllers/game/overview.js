exports.index = function(req, res, next) {
	var current_place = req.session.role.current_place;
	var type = current_place.match(/[a-z]+/g)[0];
	if(type == 'station') {
		var Stations = require('../../proxy').Stations;
		Stations.getStationById(current_place, function(err, station) {
			if(err) {
				return next(err, req, res);
			}
			if(!station) {
				//如果没有找到对应空间站
				//FIXME 修改错误处理
				var err = {
					status: 200,
					message: "Can't find the station(id = " + current_place + ")"
				};
				return next(err, req, res);
			}
			var species = require('../../constants/species');
				res.render('game/overview_station', {
					species: species.name[req.session.role.role_species - 1],
					place: station
				});
		});
	} else if(type == 'planet') {
		var Planets = require('../../proxy').Planets;
		Planets.getPlanetById(current_place, function(err, planet) {
			if(err) {
				return next(err, req, res);
			}
			if(!planet) {
				//如果没有找到对应星球
				//FIXME 修改错误处理
				var err = {
					status: 200,
					message: "Can't find the planet(id = " + current_place + ")"
				};
				return next(err, req, res);
			}
			var species = require('../../constants/species');
			res.render('game/overview_planet', {
				species: species.name[req.session.role.role_species - 1],
				place: planet
			});
		});
	}
};