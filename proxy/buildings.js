var modules = require('../modules');
var ConstBuildings = modules.ConstBuildings;

/**
 * 根据id获取建筑信息
 * callback
 * - err 数据库错误
 * - building 建筑信息
 * @param id 建筑id
 * @param callback 回调
 */
exports.getBuildingById = function(id, extension, callback) {
    if(typeof extension === 'function') {
        callback = extension;
        extension = null;
    }
    ConstBuildings.findOne({
        id: id
    }, extension, function(err, building) {
        if(err) {
            return callback(err, null);
        }
        return callback(null, building);
    });
};