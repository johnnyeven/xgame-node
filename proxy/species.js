var modules = require('../modules');
var ConstSpecies = modules.ConstSpecies;

/**
 * 根据id获取种族信息
 * callback
 * - err 数据库连接错误
 * - species 种族信息
 * @param id 种族ID
 * @param callback 回调
 */
exports.getSpeciesById = function(id, callback) {
    ConstSpecies.findOne({
        id: id
    }, function(err, species) {
        if(err) {
            return callback(err, null);
        }
        return callback(null, species);
    });
};