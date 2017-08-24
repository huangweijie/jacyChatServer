let userModule = require('../database/module/user.js')

exports.register = function(data, callback) {
	var newUser = new userModule({
		userId: data.userId,
		userName: data.username,
		password: data.password
	})
	newUser.save(callback)
}

exports.login = function(data, callback) {
	userModule.findOne({
		userName: data.username,
		password: data.password
	})
	.exec(callback)
}