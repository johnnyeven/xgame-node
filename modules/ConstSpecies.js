var mongoose = require('mongoose');
var ConstSpeciesSchema = mongoose.Schema({
	id: Number,
	name: String,
	comment: String,
	born_place: String,
	born_legion: String
});
var ConstSpecies = mongoose.model('ConstSpecies', ConstSpeciesSchema, 'const_species');

module.exports = ConstSpecies;