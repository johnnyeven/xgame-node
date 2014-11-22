module.exports = function(req, res, next) {
	res.locals.find_buildings_by_id = require('../../helpers/building_helper').find_buildings_by_id;
	var Planet = require('../../proxy').Planets;
	Planet.getPlanetById(req.params.planet_id, function(err, planet) {
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
		var buildings = require('../../constants/buildings');
		res.render('game/planet', {
			species: species.name[req.session.role.role_species - 1],
			buildings: buildings,
			planet: planet
		});
	})
};