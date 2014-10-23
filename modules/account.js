var accountdb = require('./accountdb');

function Account(account) {
	this.name = account.name;
	this.pass = account.pass;
};

module.exports = Account;

Account.prototype.save = function(callback) {
	if(this.name && this.pass) {
		var time = Math.floor((new Date()).getTime() / 1000);
		var sql = "INSERT INTO accounts(name, pass, email, regtime, lasttime)VALUES('" + this.name + "', '" + this.pass + "', '', " + time + ", 0)";
		accountdb.query(sql, function(err, rows) {
			callback(err);
		});
	} else {
		err = 'Element wanted';
		callback(err);
	}
};

Account.prototype.validate = function(callback) {
	if(this.name && this.pass) {
		var sql = "SELECT * FROM accounts WHERE name=? AND pass=?";
		accountdb.query(sql, [this.name, this.pass], function(err, rows) {
			if(rows.length > 0) {
				callback(err, rows[0]);
			} else {
				callback(err, null);
			}
		});
	} else {
		err = 'Element wanted';
		callback(err, null);
	}
}

Account.get = function(username, callback) {
	if(username) {
		var sql = "SELECT * FROM accounts WHERE name=?";
		accountdb.query(sql, username, function(err, rows) {
			if(err || rows.length == 0) {
				callback(err, null);
			} else {
				var account = new Account(rows[0]);
				callback(err, account);
			}
		});
	} else {
		err = 'Element wanted';
		callback(err, null);
	}
};