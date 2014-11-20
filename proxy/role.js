var EventProxy = require('eventproxy');
var modules = require('../modules');
var Role = modules.Role;

/**
 * 根据帐号ID获取角色
 * callback
 *  - err, 数据库错误
 *  - role, 获取到的角色
 *  @param {String} id 帐号ID
 *  @param {Function} callback 回调
 */
exports.getRoleByAccountId = function(id, callback) {
    var events = ['data'];
    var ep = EventProxy.create(events, function(data) {
        return callback(null, data);
    }).fail(callback);

    Role.findOne({
        account_id: id
    }, ep.done(function(role) {
        ep.emit('data', role);
    }));
};