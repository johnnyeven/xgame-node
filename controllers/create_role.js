module.exports = function(req, res, next) {
	var input = req.body;
	var species = input.species;
	var nickname = input.nickname;
	var attribute1 = input.attribute1;
	var attribute2 = input.attribute2;
	var attribute3 = input.attribute3;
	var attribute4 = input.attribute4;
	var attribute5 = input.attribute5;

	if(req.session.user) {
		var mongo_connect = require('../modules/MongoConnection');
		var Role = require('../modules/Role');
		mongo_connect(function(db) {
			if(db) {
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
					role_astrological: 1
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