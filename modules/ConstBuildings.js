var mongoose = require('mongoose');
var ConstBuildingsSchema = mongoose.Schema({
	id: String,
	name: String,
	comment: String,
	levels: [{
		level: Number,
		upgrade_time: Number,
		requires: {
			titanium: Number,
			crystal: Number,
			hydrogen: Number,
			water: Number,
			organics: Number,
			power: Number
		},
		production: {
			titanium: Number,
			crystal: Number,
			hydrogen: Number,
			water: Number,
			organics: Number,
			power: Number
		}
	}]
});
var ConstBuildings = mongoose.model('ConstBuildings', ConstBuildingsSchema, 'const_buildings');

module.exports = ConstBuildings;