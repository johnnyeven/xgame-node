var Account = require('../modules/account');
var crypto = require('crypto');

module.exports = function(req, res, next) {
	var input = req.body;
	var md5 = crypto.createHash('md5');
	var password = md5.update(input.password).digest('hex').toUpperCase();

	var account = new Account({
		name: input.username,
		pass: password
	});

	account.validate(function(err, acc) {
		if(err) {
			err.status = 500;
			next(err, req, res);
		} else if(!acc) {
			var err = {
				message: "Account not exist",
				status: 200
			};
			err.redirect = '/login';
			next(err, req, res);
		} else {
			req.session.user = acc;
			res.redirect('/game');
		}
	});
};