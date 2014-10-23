var mongoose = require('mongoose');
var AssestsLogSchema = mongoose.Schema({
	account: String,
	category: Number,	//1=dogecoin
	type: Number,		//1=receive, 2=send
	address: String,
	amount: Number,
	time: Number
});
var AssetsLog = mongoose.model('AssetsLog', AssestsLogSchema, 'assets_log');

module.exports = AssetsLog;