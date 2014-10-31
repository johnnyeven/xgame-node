var mongoose = require('mongoose');
var ConstPosition2Schema = mongoose.Schema({
	id: Number,
	parent: Number,
	name: String
});
var ConstPosition2 = mongoose.model('ConstPosition2', ConstPosition2Schema, 'const_position2');

module.exports = ConstPosition2;