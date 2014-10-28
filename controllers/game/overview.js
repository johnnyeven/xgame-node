module.exports = function(req, res, next) {
	var species = ['艾尔', '加特里', '迪里米克'];
	res.render('game/overview', {
		species: species[req.session.role.role_species - 1]
	});
};