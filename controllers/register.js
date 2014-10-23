var Account = require('../modules/account');
var crypto = require('crypto');

module.exports = function(req, res, next) {
	var input = req.body;
	var md5 = crypto.createHash('md5');
	var password = md5.update(input.password).digest('hex').toUpperCase();

	var newAccount = new Account({
		name: input.username,
		pass: password
	});
	
	Account.get(newAccount.name, function(err, account) {
		if(account) {
			var err = {
				status: 200,
				message: 'Username already exist.'
			};
		}
		if(err) {
			err.status = 200;
			err.redirect = '/register';
			next(err, req, res);
			return;
		}

		newAccount.save(function(err) {
			if(err) {
				err.status = 500;
				next(err, req, res);
				return;
			}
			req.session.user = newAccount;
			res.redirect('/game');
		});
	});
};