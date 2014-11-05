module.exports = function(req, res, next) {
	var mongo_connect = require('../../modules/MongoConnection');
	mongo_connect(function(db) {
		var species = ['艾尔', '加特里', '迪里米克'];
		res.render('game/planets', {
			species: species[req.session.role.role_species - 1]
		});
		db.close();
	});
};