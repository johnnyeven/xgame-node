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
	production: {					//资源总量
		titanium: Number,
		crystal: Number,
		hydrogen: Number,
		water: Number,
		organics: Number
	},
	resources: {					//资源持有量
		titanium: Number,			//钛合金
		crystal: Number,			//晶体
		hydrogen: Number,			//氚氢气
		water: Number,				//水
		organics: Number			//有机物
	},
	production_rate: {				//资源每小时产量
		titanium: Number,			//钛合金
		crystal: Number,			//晶体
		hydrogen: Number,			//氚氢气
		water: Number,				//水
		organics: Number			//有机物
	},
	last_updated: Number,			//上次更新时间
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