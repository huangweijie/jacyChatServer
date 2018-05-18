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

exports.getContactList = (data, callback) => {
    Module.grouplist.findOne({
        userId: data.userId,
        groupName: 'contact'
    }, {
        _id: 0,
        userId: 0,
        groupName: 0
    })
    .populate('groupList')
    .exec(callback)
}