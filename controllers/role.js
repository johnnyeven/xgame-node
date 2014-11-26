exports.index = function(req, res, next) {
	var Role = require('../proxy').Role;
	Role.getRoleByAccountId(req.session.user.id, function(err, role) {
		if(err) {
			return next(err, req, res);
		}
		if (role) {
			req.session.role = role;
			res.redirect('/game/overview');
		} else {
			req.session.role = null;
			res.render('create_role', {});
		}
	});
};

exports.create = function(req, res, next) {
	var input = req.body;
	var species_id = parseInt(input.species);
	var nickname = input.nickname;
	var attribute1 = input.attribute1;
	var attribute2 = input.attribute2;
	var attribute3 = input.attribute3;
	var attribute4 = input.attribute4;
	var attribute5 = input.attribute5;

	if(req.session.user) {
		var Species = require('../proxy').Species;
		Species.getSpeciesById(species_id, function (err, species) {
			if (err) {
				//FIXME 修改错误提示
				var data = {
					code: 500,
					message: err.message,
					data: null
				};
				return res.send(data);
			}

			if (species) {
				var Role = require('../proxy').Role;
				var option = {
					account_id: req.session.user.id,
					role_name: nickname,
					role_species: species_id,
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
					current_place: species.born_place,
					building_sequence: 1
				};
				Role.save(option, function (err, role) {
					if (err) {
						var data = {
							code: 500,
							message: err.message,
							data: null
						};
						return res.send(data);
					}

					req.session.role = role;
					var data = {
						code: 200,
						message: '',
						data: role
					};
					return res.send(data);
				});
			} else {
				//FIXME 修改错误提示
				var data = {
					code: 404,
					message: 'species id not found. id = ' + species,
					data: null
				};
				return res.send(data);
			}
		});
	};
};