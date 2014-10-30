var mongoose = require('mongoose');
var ConstPlanetsSchema = mongoose.Schema({
	id: String,
	name: String,
	description: String,
	position: {
		x: Number,		//星域
		y: Number,		//星座
		z: Number,		//星系
		index: Number	//位置
	},
	type: Number,		//1=固态 2=气态 3=液态
	diameter: Number,	//直径
	temperature: {
		min: Number,
		max: Number
	},	//气温
	production: {
		titanium: Number,
		crystal: Number,
		hydrogen: Number,
		water: Number,
		organics: Number
	}

});
var ConstPlanets = mongoose.model('ConstPlanets', ConstPlanetsSchema, 'const_planets');

module.exports = ConstPlanets;