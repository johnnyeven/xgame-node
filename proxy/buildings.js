var modules = require('../modules');
var ConstBuildings = modules.ConstBuildings;

/**
 * 根据id获取建筑信息
 * callback
 * - err 数据库错误
 * - building 建筑信息
 * - data 其他用户数据
 * @param id 建筑id
 * @param extension mongodb参数
 * @param data 用户数据,回调时将会回传
 * @param callback 回调
 */
exports.getBuildingById = function(id, extension, data, callback) {
    if(typeof extension === 'function') {
        callback = extension;
        extension = null;
    }
    if(typeof data === 'function') {
        callback = data;
        data = null;
    }
    ConstBuildings.findOne({
        id: id
    }, extension, function(err, building) {
        if(err) {
            return callback(err, null, data);
        }
        return callback(null, building, data);
    });
};