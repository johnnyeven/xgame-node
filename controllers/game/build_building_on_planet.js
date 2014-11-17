module.exports = function(req, res, next) {
	var input = req.body;
	var building_id = input.building_id;
	if(building_id) {
		var mongo_connect = require('../../modules/MongoConnection');
		mongo_connect(function(db) {
			if(!db) {
				var data = {
					code: 500,
					message: 'Database error.',
					data: null
				};
				return res.send(data);
			}

			var time = parseInt(new Date().getTime() / 1000);

			var Planets = require('../../modules/Planets');
			Planets.findOne({
				id: req.params.planet_id
			}, function(err, planet) {
				if(err) {
					var data = {
						code: 500,
						message: err.message,
						data: null
					};
					db.close();
					return res.send(data);
				}
				if(planet) {
					if(planet.buildings_limit.resources.indexOf(building_id) < 0 &&
						planet.buildings_limit.functions.indexOf(building_id) < 0) {
						var data = {
							code: 403,
							message: 'Building is not allow to build on this planet',
							data: null
						};
						res.send(data);
						db.close();
					} else {
						var find_buildings_index_by_id = require('../../helpers/building_helper').find_buildings_index_by_id;
						var building_index = find_buildings_index_by_id(building_id, planet.buildings);
						var current_level = 0;
						if(building_index >= 0) {
							var planet_building = planet.buildings[building_index];
							if(planet_building.complete_time > time) {
								db.close();
								var data = {
									code: 402,
									message: 'Building is updating. Not allow to upgrade again.',
									data: null
								};
								return res.send(data);
							}
							current_level = planet_building.level;
						}
						var ConstBuildings = require('../../modules/ConstBuildings');
						ConstBuildings.findOne({
							id: building_id,
						}, {
							'levels': {
								'$slice': [current_level, 1]
							}
						}, function(err, building) {
							if(err) {
								db.close();
								var data = {
									code: 500,
									message: err.message,
									data: null
								};
								return res.send(data);
							}
							if(!building) {
								db.close();
								var data = {
									code: 404,
									message: 'The building is not exist.',
									data: building
								};
								return res.send(data);
							}

							var required = building.levels[0].requires;
							var resources = req.session.role.resources;

							if(resources.titanium >= required.titanium &&
								resources.crystal >= required.crystal &&
								resources.hydrogen >= required.hydrogen &&
								resources.water >= required.water &&
								resources.organics >= required.organics) {

								req.session.role.resources.titanium -= required.titanium;
								req.session.role.resources.crystal -= required.crystal;
								req.session.role.resources.hydrogen -= required.hydrogen;
								req.session.role.resources.water -= required.water;
								req.session.role.resources.organics -= required.organics;
								req.session.role.save(function(err, doc) {
									if(building_index >= 0) {
										planet.buildings[building_index].level++;
										planet.buildings[building_index].complete_time = time + building.levels[0].upgrade_time;
									} else {
										var b = {
											id: building.id,
											level: building.levels[0].level,
											complete_time: time + building.levels[0].upgrade_time
										}
										planet.buildings.push(b);
									}
									planet.save(function(err, doc) {
										db.close();
										if(err) {
											var data = {
												code: 500,
												message: err.message,
												data: building
											};
											return res.send(data);
										}

										var data = {
											code: 200,
											message: '',
											data: doc
										};
										return res.send(data);
									});
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
					db.close();
					var data = {
						code: 404,
						message: 'The planet is not exist.',
						data: null
					};
					return res.send(data);
				}
			});
		});
	} else {
		var data = {
			code: 500,
			message: 'The parameter(building_id) is required.',
			data: null
		};
		return res.send(data);
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