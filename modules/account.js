module.exports = function(sequelize, DataType) {
	var Account = sequelize.define('Account', {
		name: DataType.STRING,
		pass: DataType.STRING,
		email: {
			type: DataType.STRING,
			defaultValue: ''
		},
		lasttime: {
			type: DataType.INTEGER,
			defaultValue: 0
		},
		regtime: {
			type: DataType.INTEGER,
			defaultValue: 0
		}

	}, {
		tableName: 'accounts',
		timestamps: false,
		updatedAt: 'lasttime',
		createdAt: 'regtime'
	});

	return Account;
};