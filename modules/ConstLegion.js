var mongoose = require('mongoose');
var ConstLegionSchema = mongoose.Schema({
	id: String,
	union: String,
	name: String,
	comment: String
});
var ConstLegion = mongoose.model('ConstLegion', ConstLegionSchema, 'const_legion');

module.exports = ConstLegion;