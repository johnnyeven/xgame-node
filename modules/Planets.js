var mongoose = require('mongoose');
var PlanetsSchema = mongoose.Schema({
	id: String,
	name: String,
	description: String,
	position: {
		x: Number,		//星域
		y: Number,		//星座
		z: Number,		//星系
		index: Number	//位置
	},
	is_npc_legion: Boolean,
	legion: String,
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
	},
	owner: String,		//占领者
	buildings_limit: {
		resources: [String],
		functions: [String]
	},
	buildings: [{
		id: String,
		level: Number,
		start_time: Number,
		complete_time: Number
	}]

});
var Planets = mongoose.model('Planets', PlanetsSchema, 'planets');

module.exports = Planets;