var mongoose = require('mongoose');
var config = require('../config/config');

mongoose.connect('mongodb://' + config.game_db.ip + '/' + config.game_db.database, function(err) {
    if(err) {
        console.error('Connect to mongodb fail: %s', err.message);
        process.exit(1);
    }
});

require('./ConstBuildings');
require('./ConstLegion');
require('./ConstPosition1');
require('./ConstPosition2');
require('./ConstPosition3');
require('./ConstSpecies');
require('./ConstStations');
require('./ConstUnion');
require('./Planets');
require('./Role');

exports.ConstBuildings = mongoose.model('ConstBuildings');
exports.ConstLegion = mongoose.model('ConstLegion');
exports.ConstPosition1 = mongoose.model('ConstPosition1');
exports.ConstPosition2 = mongoose.model('ConstPosition2');
exports.ConstPosition3 = mongoose.model('ConstPosition3');
exports.ConstSpecies = mongoose.model('ConstSpecies');
exports.ConstStations = mongoose.model('ConstStations');
exports.ConstUnion = mongoose.model('ConstUnion');
exports.Planets = mongoose.model('Planets');
exports.Role = mongoose.model('Role');