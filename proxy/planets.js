var EventProxy = require('eventproxy');
var modules = require('../modules');
var Planet = modules.Planets;
var ConstPosition1 = modules.ConstPosition1;
var ConstPosition2 = modules.ConstPosition2;
var ConstPosition3 = modules.ConstPosition3;

/**
 * 根据ID获取星球信息
 * callback
 * - err 数据库错误
 * - planet 星球信息
 * @param id 星球ID
 * @param callback 回调
 */
exports.getPlanetById = function(id, callback) {
    Planet.findOne({
        id: id
    }, function(err, planet) {
        if(err) {
            return callback(err, null);
        }

        var events = ['position1', 'position2', 'position3'];
        var ep = EventProxy.create(events, function(position1, position2, position3) {
            planet.position_native = {
                x: position1.name,
                y: position2.name,
                z: position3.name,
                index: planet.position.index
            };
            return callback(null, planet);
        }).fail(callback);

        ConstPosition1.findOne({
            id: planet.position.x
        }, ep.done(function(position1) {
            ep.emit('position1', position1);
        }));

        ConstPosition2.findOne({
            id: planet.position.y
        }, ep.done(function(position2) {
            ep.emit('position2', position2);
        }));

        ConstPosition3.findOne({
            id: planet.position.z
        }, ep.done(function(position3) {
            ep.emit('position3', position3);
        }));
    });
};

/**
 * 根据所有者获取星球信息
 * callback
 * - err 数据库错误
 * - planets 星球列表
 * @param owner 所有者
 * @param callback 回调
 */
exports.getPlanetsByOwner = function(owner, callback) {
    Planet.find({
        owner: owner
    }, function(err, planets) {
        if(err) {
            return callback(err, null);
        }
        return callback(null, planets);
    });
};