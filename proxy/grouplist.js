let Module = require('../database/module')

exports.getGroupList = (data, callback) => {
	Module.grouplist.find({
		userId: data.userId
	}, {
		_id: 0,
		userId: 0
	})
	.exec(callback)
}