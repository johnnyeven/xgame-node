var can_construct = function(planet, limit) {
	var time = parseInt(new Date().getTime() / 1000);
	var total_construction = 0;
	for( var i in planet.buildings) {
		if(planet.buildings[i].complete_time > time) {
			total_construction++;
			if(total_construction >= limit) {
				return false;
			}
		}
	}
	return true;
};

exports.index = function(req, res, next) {
	res.locals.find_buildings_by_id = require('../../helpers/building_helper').find_buildings_by_id;
	res.locals.format_count_down = require('../../helpers/time_helper').format_count_down;
	var Planet = require('../../proxy').Planets;
	Planet.getPlanetById(req.params.planet_id, function(err, planet) {
		if(err) {
			return next(err, req, res);
		}
		if(!planet) {
			//如果没有找到对应星球
			//FIXME 修改错误处理
			err = {
				status: 200,
				message: "Can't find the planet(id = " + current_place + ")"
			};
			return next(err, req, res);
		}
		req.session.planet = planet;
		var buildings = require('../../constants/buildings');

		var time = parseInt(new Date().getTime() / 1000);
		res.render('game/planet', {
			time: time,
			buildings: buildings,
			planet: planet,
			can_construct: can_construct(planet, req.session.role.building_sequence)
		});
	})
};

exports.get_building_on_planet = function(req, res, next) {
	var Planets = require('../../proxy').Planets;
	Planets.getPlanetById(req.params.planet_id, function(err, planet) {
		if(err) {
			var data = {
				code: 500,
				message: err.message,
				data: null
			};
			res.send(data);
		}
		var building_id = req.params.building_id;
		if(planet.buildings_limit.resources.indexOf(building_id) < 0 &&
			planet.buildings_limit.functions.indexOf(building_id) < 0) {
			var data = {
				code: 403,
				message: 'Building is not allow to build on this planet',
				data: null
			};
			res.send(data);
		} else {
			var find_buildings_by_id = require('../../helpers/building_helper').find_buildings_by_id;
			var b = find_buildings_by_id(building_id, planet.buildings);
			var current_level = 0;
			if(b) {
				current_level = b.level;
			}
			var slice = [current_level, 1];
			if(current_level) {
				slice[0] = current_level - 1;
				slice[1] = 2;
			}

			var Buildings = require('../../proxy').Buildings;
			Buildings.getBuildingById(building_id, {
				'levels': {
					'$slice': slice
				}
			}, function(err, building) {
				if(err) {
					var data = {
						code: 500,
						message: err.message,
						data: null
					};
					return res.send(data);
				}
				var data = {
					code: 200,
					message: '',
					data: {
						planet: planet,
						building: building,
						can_construct: can_construct(planet, req.session.role.building_sequence)
					}
				};
				res.send(data);
			});
		}
	});
};

exports.build_building_on_planet = function(req, res, next) {
	var input = req.body;
	var building_id = input.building_id;
	if(building_id) {
		var Planets = require('../../proxy').Planets;
		Planets.getPlanetById(req.params.planet_id, function (err, planet) {
			if (err) {
				var data = {
					code: 500,
					message: err.message,
					data: null
				};
				return res.send(data);
			}
			var time = parseInt(new Date().getTime() / 1000);
			if (planet) {
				if (planet.buildings_limit.resources.indexOf(building_id) < 0 &&
					planet.buildings_limit.functions.indexOf(building_id) < 0) {
					var data = {
						code: 403,
						message: 'Building is not allow to build on this planet',
						data: null
					};
					return res.send(data);
				} else {
					if(!can_construct(planet, req.session.role.building_sequence)) {
						var data = {
							code: 403,
							message: '建造队列已满',
							data: null
						};
						return res.send(data);
					}
					var find_buildings_index_by_id = require('../../helpers/building_helper').find_buildings_index_by_id;
					var building_index = find_buildings_index_by_id(building_id, planet.buildings);
					var current_level = 0;
					if (building_index >= 0) {
						var planet_building = planet.buildings[building_index];
						if (planet_building.complete_time > time) {
							var data = {
								code: 402,
								message: 'Building is updating. Not allow to upgrade again.',
								data: null
							};
							return res.send(data);
						}
						current_level = planet_building.level;
					}
					var slice = [current_level, 1];
					if (current_level) {
						slice[0] = current_level - 1;
						slice[1] = 2;
					}

					var Buildings = require('../../proxy').Buildings;
					Buildings.getBuildingById(building_id, {
						'levels': {
							'$slice': slice
						}
					}, function (err, building) {
						if (err) {
							var data = {
								code: 500,
								message: err.message,
								data: null
							};
							return res.send(data);
						}
						if (!building) {
							var data = {
								code: 404,
								message: 'The building is not exist.',
								data: building
							};
							return res.send(data);
						}

						var required = building.levels[0].requires;
						var resources = planet.resources;

						if (resources.titanium >= required.titanium &&
							resources.crystal >= required.crystal &&
							resources.hydrogen >= required.hydrogen &&
							resources.water >= required.water &&
							resources.organics >= required.organics) {

							planet.resources.titanium -= required.titanium;
							planet.resources.crystal -= required.crystal;
							planet.resources.hydrogen -= required.hydrogen;
							planet.resources.water -= required.water;
							planet.resources.organics -= required.organics;

							if (building_index >= 0) {
								planet.buildings[building_index].level++;
								planet.buildings[building_index].start_time = time;
								planet.buildings[building_index].complete_time = time + building.levels[0].upgrade_time;
							} else {
								var b = {
									id: building.id,
									level: building.levels[0].level,
									start_time: time,
									complete_time: time + building.levels[0].upgrade_time
								}
								planet.buildings.push(b);
							}
							planet.save(function (err, doc) {
								if (err) {
									var data = {
										code: 500,
										message: err.message,
										data: null
									};
									return res.send(data);
								}

								var data = {
									code: 200,
									message: '',
									data: {
										building: building,
										planet: doc,
										can_construct: can_construct(doc, req.session.role.building_sequence)
									}
								};
								return res.send(data);
							});
						} else {
							var data = {
								code: 400,
								message: 'Resource not enough.',
								data: building
							};
							return res.send(data);
						}
					});
				}
			} else {
				var data = {
					code: 404,
					message: 'The planet is not exist.',
					data: null
				};
				return res.send(data);
			}
		});
	}
};
/*
 db.const_buildings.aggregate([
 {
 $match: {
 id: "building_1001"
 }
 },
 {
 $unwind: '$levels'
 },
 {
 $match: {
 'levels.level': {
 $gte: 4,
 $lte: 6
 }
 }
 },
 {
 $group: {
 levels: {$push: '$levels'},
 _id: null
 }
 }
 ]);
 */