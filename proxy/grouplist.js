let Module = require('../database/module')

exports.getGroupList = (data, callback) => {
	Module.grouplist.find({
		userName: data.userName
	}, {
		_id: 0,
		userName: 0
	})
	.exec(callback)
}