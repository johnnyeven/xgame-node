var mongoose = require('mongoose');
var ConstStationsSchema = mongoose.Schema({
	id: String,
	name: String,
	description: String,
	position: {
		x: Number,		//星域
		y: Number,		//星座
		z: Number,		//星系
		index: Number	//位置
	},
	services: Array
});
var ConstStations = mongoose.model('ConstStations', ConstStationsSchema, 'const_stations');

module.exports = ConstStations;