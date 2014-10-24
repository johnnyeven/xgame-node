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
		name: input.username
	};

	Account.find({
		where: param
	}).complete(function(err, account) {
		if(account) {
			var err = {
				status: 200,
				message: 'Username already exist.'
			};
			next(err, req, res);
			return;
		}
		if(err) {
			err.status = 200;
			err.redirect = '/register';
			next(err, req, res);
			return;
		}

		var newAccount = Account.build({
			name: input.username,
			pass: password
		});
		newAccount.save().complete(function(err) {
			if(err) {
				err.status = 500;
				next(err, req, res);
				return;
			}
			req.session.user = newAccount;
			res.redirect('/role');
		});
	});
};