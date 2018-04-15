let Module = require('../database/module')

exports.register = (data, callback) => {
	let newUser = new Module.userModule({
		userId: data.userId,
		userName: data.userName,
		password: data.password
	})
	newUser.save()
	.then(() => {
		let group = new Module.grouplist({
			userId: data.userId,
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
			userId: data.userId,
			groupName: '我的好友',
			groupStatus: false,
			groupList: []
		})
		return group.save(callback)
	}, (err) => {
		callback && callback(err)
	})
}

exports.login = (data, callback) => {
	Module.userModule.findOne({
		userId: data.userId,
		password: data.password
	}, {
		_id: 0
	})
	.exec(callback)
}

exports.search = (data, callback) => {
	Module.userModule.findOne({
		userId: data.userId.userId
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
				'userId': {
					'$ne': data.userId.userId,
					'$nin': result.friendList
				}
			}, {
				userName: 1,
				userId: 1,
				head: 1,
				_id: 0
			})
			.exec(callback)
		}
	})
}

exports.addFriend = (data, callback) => {
	Module.userModule.update({
		userId: data.addUser.userId
	}, {
		'$addToSet': {
			friendList: data.addedUser.userId
		}
	})
	.exec((err, result) => {
		if(!err) {
			Module.grouplist.update({
				userId: data.addUser.userId,
				groupName: '我的好友'
			}, {
				'$addToSet': {
					groupList: {
						name: data.addedUser.userName,
						contactId: data.addedUser.userId,
						head: data.addedUser.head
					}
				}
			})
			.exec((err, result) => {
				if(!err) {
					Module.userModule.update({
						userId: data.addedUser.userId
					}, {
						'$addToSet': {
							friendList: data.addUser.userId
						}
					})
					.exec((err, result) => {
						if(!err) {
							Module.userModule.findOne({
								userId: data.addUser.userId
							})
							.exec((err, result) => {
								if(!err) {
									Module.grouplist.update({
										userId: data.addedUser.userId,
										groupName: '我的好友'
									}, {
										'$addToSet': {
											groupList: {
												name: result.userName,
												contactId: data.addUser.userId,
												head: result.head
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

exports.changePerMes = (data, callback) => {
	Module.userModule.update({
		userId: data.user.userId
	}, {
		userName: data.changeMes.userName,
		head: data.changeMes.head
	})
	.exec(callback)
}

exports.updateRecent = (data, callback) => {
	Module.grouplist.update({
		userId: data.addUser.userId,
		groupName: '最近联系人'
	}, {
		'$addToSet': {
			groupList: {
				name: data.addedUser.userName,
				contactId: data.addedUser.userId,
				head: data.addedUser.head
			}
		}
	})
	.exec((err, result) => {
		if(!err) {
			Module.userModule.findOne({
				userId: data.addUser.userId
			})
			.exec((err, result) => {
				if(!err) {
					Module.grouplist.update({
						userId: data.addedUser.userId,
						groupName: '最近联系人'
					}, {
						'$addToSet': {
							groupList: {
								name: result.userName,
								contactId: data.addUser.userId,
								head: result.head
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
}