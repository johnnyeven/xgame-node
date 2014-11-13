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
						var find_buildings_by_id = require('../../helpers/building_helper').find_buildings_by_id;
						var b = find_buildings_by_id(building_id, planet.buildings);
						var current_level = 0;
						if(b) {
							current_level = b.level;
						}
						var ConstBuildings = require('../../modules/ConstBuildings');
						ConstBuildings.findOne({
							id: building_id,
						}, {
							'levels': {
								'$slice': [current_level, 1]
							}
						}, function(err, building) {
							db.close();
							if(err) {
								var data = {
									code: 500,
									message: err.message,
									data: null
								};
								return res.send(data);
							}
							if(!building) {
								var data = {
									code: 404,
									message: 'The building is not exist.',
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
			}
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