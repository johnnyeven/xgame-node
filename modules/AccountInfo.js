var mongoose = require('mongoose');
var AccountInfoSchema = mongoose.Schema({
	account: String,
	dogecoin: {
		amount: Number,
		charge_address: String,
		charge_expire: Number,
		charge_trans_offset: Number
	}
});
var AccountInfo = mongoose.model('AccountInfo', AccountInfoSchema, 'account_info');

module.exports = AccountInfo;