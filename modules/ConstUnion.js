var mongoose = require('mongoose');
var ConstUnionSchema = mongoose.Schema({
	id: String,
	name: String,
	comment: String
});
var ConstUnion = mongoose.model('ConstUnion', ConstUnionSchema, 'const_union');

module.exports = ConstUnion;