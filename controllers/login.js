var Sequelize = require('sequelize');
var sequelize = require('../modules/MysqlConnection');
var AccountFactory = require('../modules/Account');
var Account = AccountFactory(sequelize, Sequelize);
var crypto = require('crypto');

module.exports = function(req, res, next) {
	var input = req.body;
	var md5 = crypto.createHash('md5');
	var password = md5.update(input.password).digest('hex').toUpperCase();

	var param = {
		name: input.username,
		pass: password
	};
	Account.find({
		where: param
	}).complete(function(err, account) {
		if(err) {
			err.status = 500;
			next(err, req, res);
		} else if(!account) {
			var err = {
				message: "Account not exist",
				status: 200
			};
			err.redirect = '/login';
			next(err, req, res);
		} else {
			req.session.user = account;
			res.redirect('/game');
		}
	});
};