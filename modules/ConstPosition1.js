var mongoose = require('mongoose');
var ConstPosition1Schema = mongoose.Schema({
	id: Number,
	name: String
});
var ConstPosition1 = mongoose.model('ConstPosition1', ConstPosition1Schema, 'const_position1');

module.exports = ConstPosition1;