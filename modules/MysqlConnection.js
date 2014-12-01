var config = require('../config');
var Sequelize = require('sequelize'),
sequelize = new Sequelize(config.account_db.database, config.account_db.user, config.account_db.password, {
	dialect: 'mysql',
	host: config.account_db.ip,
	port: config.account_db.port
});

module.exports = sequelize;