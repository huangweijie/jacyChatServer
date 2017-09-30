let Module = require('../database/module')

exports.register = (data, callback) => {
	let newUser = new Module.userModule({
		userId: data.userId,
		userName: data.username,
		password: data.password
	})
	newUser.save()
	.then(() => {
		let group = new Module.grouplist({
			userName: data.username,
			groupName: '最近联系人',
			groupStatus: false,
			groupList: []
		})
		return group.save()
	}, (err) => {
		callback && callback(err)
	})
	.then(() => {
		let group = new Module.grouplist({
			userName: data.username,
			groupName: '我的好友',
			groupStatus: false,
			groupList: []
		})
		return group.save()
	}, (err) => {
		callback && callback(err)
	})
	.then(() => {
		let group = new Module.grouplist({
			userName: data.username,
			groupName: '陌生人',
			groupStatus: false,
			groupList: []
		})
		group.save(callback)
	}, (err) => {
		callback && callback(err)
	})
}

exports.login = (data, callback) => {
	Module.userModule.findOne({
		userName: data.username,
		password: data.password
	}, {
		_id: 0
	})
	.exec(callback)
}

exports.search = (data, callback) => {
	Module.userModule.findOne({
		userName: data.userName.userName
	}, {
		friendList: 1,
		_id: 0
	})
	.exec((err, result) => {
		if(!err) {
			Module.userModule.find({
				"$or": [{
						userName: new RegExp(data.query.searchMes, 'g')
					},{
						userId: new RegExp(data.query.searchMes, 'g')
					}
				],
				'userName': {
					'$ne': data.userName.userName,
					'$nin': result.friendList
				}
			}, {
				userName: 1,
				userId: 1,
				_id: 0
			})
			.exec(callback)
		}
	})
}

exports.addFriend = (data, callback) => {
	Module.userModule.update({
		userName: data.addUser.userName
	}, {
		'$addToSet': {
			friendList: data.addedUser.userName
		}
	})
	.exec((err, result) => {
		if(!err) {
			Module.grouplist.update({
				userName: data.addUser.userName,
				groupName: '我的好友'
			}, {
				'$addToSet': {
					groupList: {
						name: data.addedUser.userId,
						contactId: data.addedUser.userName
					}
				}
			})
			.exec((err, result) => {
				if(!err) {
					Module.userModule.update({
						userName: data.addedUser.userName
					}, {
						'$addToSet': {
							friendList: data.addUser.userName
						}
					})
					.exec((err, result) => {
						if(!err) {
							Module.userModule.findOne({
								userName: data.addUser.userName
							})
							.exec((err, result) => {
								if(!err) {
									Module.grouplist.update({
										userName: data.addedUser.userName,
										groupName: '我的好友'
									}, {
										'$addToSet': {
											groupList: {
												name: result.userId,
												contactId: data.addUser.userName
											}
										}
									})
									.exec((err, result) => {
										if(!err) {
											callback && callback(null, result)
										}else {
											callback && callback(err)
										}
									})
								}else {
									callback && callback(err)
								}
							})
						}else {
							callback && callback(err)
						}
					})
				}else {
					callback && callback(err)
				}
			})
		}else {
			callback && callback(err);
		}
	})
}