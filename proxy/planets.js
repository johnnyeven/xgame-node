var EventProxy = require('eventproxy');
var modules = require('../modules');
var Planet = modules.Planets;
var ConstPosition1 = modules.ConstPosition1;
var ConstPosition2 = modules.ConstPosition2;
var ConstPosition3 = modules.ConstPosition3;
var BuildingProxy = require('./buildings');
var log4js = require('log4js');
var logger = log4js.getLogger('debug');

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

/**
 * 重建星球资源产量信息
 * @param planet
 * @param callback
 */
exports.rebuildPlanetProduction = function(planet, callback) {
	var rate = {
		titanium: 0,		//钛合金
		crystal: 0,			//晶体
		hydrogen: 0,		//氚氢气
		water: 0,			//水
		organics: 0			//有机物
	};
    var time = parseInt(new Date().getTime() / 1000);
	var EventProxy = require('eventproxy');
	var ep = new EventProxy();
	ep.after('get_building', planet.buildings.length, function(results) {
        planet.production_rate.titanium = rate.titanium;
        planet.production_rate.crystal = rate.crystal;
        planet.production_rate.hydrogen = rate.hydrogen;
        planet.production_rate.water = rate.water;
        planet.production_rate.organics = rate.organics;
        planet.last_updated = time;
        planet.save();
		callback(null);
	});
    var add_resources = function(planet, building, percentage, index) {
        var titanium = building.levels[index].production.titanium * percentage;
        if(planet.production.titanium >= titanium) {
            planet.production.titanium -= titanium;
            planet.resources.titanium += titanium;
        } else {
            planet.resources.titanium += planet.production.titanium;
            planet.production.titanium = 0;
        }
        var crystal = building.levels[index].production.crystal * percentage;
        if(planet.production.crystal >= crystal) {
            planet.production.crystal -= crystal;
            planet.resources.crystal += crystal;
        } else {
            planet.resources.crystal += planet.production.crystal;
            planet.production.crystal = 0;
        }
        var hydrogen = building.levels[index].production.hydrogen * percentage;
        if(planet.production.hydrogen >= hydrogen) {
            planet.production.hydrogen -= hydrogen;
            planet.resources.hydrogen += hydrogen;
        } else {
            planet.resources.hydrogen += planet.production.hydrogen;
            planet.production.hydrogen = 0;
        }
        var water = building.levels[index].production.water * percentage;
        if(planet.production.water >= water) {
            planet.production.water -= water;
            planet.resources.water += water;
        } else {
            planet.resources.water += planet.production.water;
            planet.production.water = 0;
        }
        var organics = building.levels[index].production.organics * percentage;
        if(planet.production.organics >= organics) {
            planet.production.organics -= organics;
            planet.resources.organics += organics;
        } else {
            planet.resources.organics += planet.production.organics;
            planet.production.organics = 0;
        }
        return planet;
    };
	for(var i = 0; i < planet.buildings.length; ++i) {
		var building = planet.buildings[i];
		if(building) {
            var slice = [building.level - 1, 1];
            if(building.level > 1) {
                slice[0] = building.level - 2;
                slice[1] = 2;
            }
            BuildingProxy.getBuildingById(building.id, {
                'levels': {
                    '$slice': slice
                }
            }, building, function (err, b, building) {
                if (err) {
                    callback(err);
                }
                if (b) {
                    //更新资源数量
                    var percentage = 0;
                    var index = 0;
                    if(building.complete_time > time) {
                        //未建成
                        if(building.level > 1) {
                            percentage = (time - planet.last_updated) / 3600;
                            index = 0;
                            planet = add_resources(planet, b, percentage, index);
                        }
                    } else {
                        //已建成
                        if(building.complete_time > planet.last_updated) {
                            if(building.level > 1) {
                                percentage = (building.complete_time - planet.last_updated) / 3600;
                                index = 0;
                                planet = add_resources(planet, b, percentage, index);
                                percentage = (time - building.complete_time) / 3600;
                                index = 1;
                            } else {
                                percentage = (time - building.complete_time) / 3600;
                                index = 0;
                            }
                            planet = add_resources(planet, b, percentage, index);
                        } else {
                            percentage = (time - planet.last_updated) / 3600;
                            if(building.level > 1) {
                                index = 1;
                            } else {
                                index = 0;
                            }
                            planet = add_resources(planet, b, percentage, index);
                        }
                    }

                    //更新产量
                    rate.titanium += b.levels[0].production.titanium;
                    rate.crystal += b.levels[0].production.crystal;
                    rate.hydrogen += b.levels[0].production.hydrogen;
                    rate.water += b.levels[0].production.water;
                    rate.organics += b.levels[0].production.organics;
                    ep.emit('get_building', b);
                } else {
                    logger.error('警告 rebuild_planet_resource_rate 无法获取建筑信息');
                    ep.emit('get_building', null);
                }
            });
        } else {
            ep.emit('get_building', null);
        }
	}
}