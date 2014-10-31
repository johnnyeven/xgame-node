var mongoose = require('mongoose');
var ConstPosition3Schema = mongoose.Schema({
	id: Number,
	parent: Number,
	name: String
});
var ConstPosition3 = mongoose.model('ConstPosition3', ConstPosition3Schema, 'const_position3');

module.exports = ConstPosition3;