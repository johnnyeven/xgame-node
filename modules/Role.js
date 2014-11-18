var mongoose = require('mongoose');
var RoleSchema = mongoose.Schema({
	account_id: Number,
	role_name: String,
	role_species: Number,			//1=艾尔 2=加特里 3=迪里米克
	role_perception: Number,		//感知
	role_perseverance: Number,		//毅力
	role_intelligence: Number,		//智力
	role_enchantment: Number,		//魅力
	role_memory: Number,			//记忆
	role_regtime: Date,
	role_astrological: Number,		//星座
	resources: {
		gold: Number,				//金币，
		antimatter: Number,			//反物质
		titanium: Number,			//钛合金
		crystal: Number,			//晶体
		hydrogen: Number,			//氚氢气
		water: Number,				//水
		organics: Number,			//有机物,
		updated: Number				//上次更新时间
	},
	production_rate: {
		gold: Number,				//金币，
		antimatter: Number,			//反物质
		titanium: Number,			//钛合金
		crystal: Number,			//晶体
		hydrogen: Number,			//氚氢气
		water: Number,				//水
		organics: Number,			//有机物,
		updated: Number				//上次更新时间
	},
	current_place: String			//目前所在地
});
RoleSchema.methods.rebuild_production_rate = function(db, callback) {
	if(db) {

	} else {
		var err = {
			status: 500,
			message: 'db is required'
		};
		callback(err);
	}
};
var Role = mongoose.model('Role', RoleSchema, 'roles');

module.exports = Role;