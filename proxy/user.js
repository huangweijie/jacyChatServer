let Module = require('../database/module');

let formidable = require('formidable');
let fs = require('fs');

const host = 'http://localhost:3000/';

function rename(old, _new, code, bId) {
	var path = './public/' + code + '/';
	if (fs.existsSync(path)) {
		_new = _new.split('.');
		name = _new[0] + new Date().getTime() + '.' + _new[1];
		fs.renameSync(old, path + name);
	} else {
		fs.mkdir(path);
		_new = _new.split('.');
		name = _new[0] + new Date().getTime() + '.' + _new[1];
		fs.renameSync(old, path + name);
	}
	return name;
}

exports.register = (data, callback) => {
	let form = new formidable.IncomingForm();
	form.uploadDir = './public/';
	var registerData;
	form.parse(data, function(err, fields, files) {
		registerData = fields;
		if (files.head) {
			var name = rename(files.head.path, files.head.name, 'head');
			registerData.head = host + 'head/' + name;
		} else {
			registerData.head = 'null';
		};

		let newUser = new Module.userModule({
			_id: registerData.userId,
			userId: registerData.userId,
			userName: registerData.userName,
			password: registerData.password,
			sex: registerData.sex,
			head: registerData.head
		})
		newUser.save()
		.then(() => {
			let group = new Module.grouplist({
				userId: data.userId,
				groupName: 'chat',
				groupStatus: false,
				groupList: []
			})
			return group.save()
		})
		.then(() => {
			let group = new Module.grouplist({
				userId: data.userId,
				groupName: 'contact',
				groupStatus: false,
				groupList: []
			})
			return group.save(callback.bind(null, registerData))
		})
		.catch((err) => {
			callback && callback(err)
		})
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
				groupName: 'contact'
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
										groupName: 'contact'
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