module.exports = function(req, res, next) {
	var input = req.body;
	var species = parseInt(input.species);
	var nickname = input.nickname;
	var attribute1 = input.attribute1;
	var attribute2 = input.attribute2;
	var attribute3 = input.attribute3;
	var attribute4 = input.attribute4;
	var attribute5 = input.attribute5;

	if(req.session.user) {
		var mongo_connect = require('../modules/MongoConnection');
		mongo_connect(function(db) {
			if(db) {
				var ConstSpecies = require('../modules/ConstSpecies');
				ConstSpecies.findOne({
					id: species
				}, function(err, s) {
					if(err) {
						var data = {
							code: 500,
							message: err.message,
							data: null
						};
						res.send(data);
					}
					if(s) {
						var Role = require('../modules/Role');
						var role = new Role({
							account_id: req.session.user.id,
							role_name: nickname,
							role_species: species,
							role_perception: attribute1,
							role_perseverance: attribute2,
							role_intelligence: attribute3,
							role_enchantment: attribute4,
							role_memory: attribute5,
							role_regtime: new Date(),
							role_astrological: 1,
							resources: {
								gold: 0,
								antimatter: 0,
								titanium: 500,
								crystal: 500,
								hydrogen: 100,
								water: 0,
								organics: 0
							},
							current_place: s.born_place
						});
						role.save(function(err) {
							if(err) {
								db.close();
								err.status = 500;
								return next(err, req, res);
							}

							req.session.role = role;
							var data = {
								code: 200,
								message: '',
								data: role
							};
							res.send(data);
							db.close();
						});
					} else {
						var data = {
							code: 404,
							message: 'species id not found. id = ' + species,
							data: null
						};
						res.send(data);
					}
				});
			} else {
				var data = {
					code: 500,
					message: 'database connections failed.',
					data: null
				};
				res.send(data);
			}
		});
	} else {
		var data = {
			code: 404,
			message: 'User not login.',
			data: null
		};
		res.send(data);
	}
};