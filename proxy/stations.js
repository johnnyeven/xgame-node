var EventProxy = require('eventproxy');
var modules = require('../modules');
var ConstStations = modules.ConstStations;
var ConstPosition1 = modules.ConstPosition1;
var ConstPosition2 = modules.ConstPosition2;
var ConstPosition3 = modules.ConstPosition3;

/**
 * 根据ID获取空间站信息
 * callback
 * - err 数据库错误
 * - station 空间站信息
 * @param id 空间站ID
 * @param callback 回调
 */
exports.getStationById = function(id, callback) {
    ConstStations.findOne({
        id: id
    }, function(err, station) {
        if(err) {
            return callback(err, null);
        }

        var events = ['position1', 'position2', 'position3'];
        var ep = EventProxy.create(events, function(position1, position2, position3) {
            station.position_native = {
                x: position1.name,
                y: position2.name,
                z: position3.name,
                index: station.position.index
            };
            return callback(null, station);
        }).fail(callback);

        ConstPosition1.findOne({
            id: station.position.x
        }, ep.done(function(position1) {
            ep.emit('position1', position1);
        }));

        ConstPosition2.findOne({
            id: station.position.y
        }, ep.done(function(position2) {
            ep.emit('position2', position2);
        }));

        ConstPosition3.findOne({
            id: station.position.z
        }, ep.done(function(position3) {
            ep.emit('position3', position3);
        }));
    });
};