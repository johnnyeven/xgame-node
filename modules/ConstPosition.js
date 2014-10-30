var mongoose = require('mongoose');
var ConstPositionSchema = mongoose.Schema({
	id: Number,
	name: String,
	y: [{
		id: Number,
		name: String,
		z: [{
			id: Number,
			name: String
		}]
	}]
});
var ConstPosition = mongoose.model('ConstPosition', ConstPositionSchema, 'const_position');

module.exports = ConstPosition;