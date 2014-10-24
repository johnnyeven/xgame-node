var mongoose = require('mongoose');
var RoleSchema = mongoose.Schema({
	account_id: Number,
	role_name: String,
	role_species: Number,
	role_perception: Number,		//感知
	role_perseverance: Number,		//毅力
	role_intelligence: Number,		//智力
	role_enchantment: Number,		//魅力
	role_memory: Number,			//记忆
	role_regtime: Date,
	role_astrological: Number		//星座
});
var Role = mongoose.model('Role', RoleSchema, 'roles');

module.exports = Role;