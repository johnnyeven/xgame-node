module.exports = function(req, res, next) {
	var mongo_connect = require('../../modules/MongoConnection');
	mongo_connect(function(db) {
		if(!db) {
			var data = {
				code: 500,
				message: 'Database error.',
				data: null
			};
			res.send(data);
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
				res.send(data);
				db.close();
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
				db.close();
			} else {
				var find_buildings_by_id = require('../../helpers/building_helper').find_buildings_by_id;
				var b = find_buildings_by_id(building_id, planet.buildings);
				var current_level = 0;
				if(b) {
					current_level = b.level;
				}
				var ConstBuildings = require('../../modules/ConstBuildings');
				var slice = [current_level, 1];
				if(current_level) {
					slice[0] = current_level - 1;
					slice[1] = 2;
				}
				ConstBuildings.findOne({
					id: building_id,
				}, {
					'levels': {
						'$slice': slice
					}
				}, function(err, doc) {
					db.close();
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
						data: doc
					};
					res.send(data);
				});
			}
		});
	});
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