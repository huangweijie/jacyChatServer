var proxy = require('./proxy')
var app = require('./server')
var jwt = require('jwt-simple')


exports.login = (req, res) => {
	proxy.user.login(req.body, (err, result) => {
		if(!err) {
			if(result) {
				let token = jwt.encode({
					userId: result.userId
				}, app.key)
				res.cookie('access_token',token, {
					maxAge: 31536000000,
					httpOnly: true
				})
				res.send({
					code: 1,
					msg: 'login successful',
					user: {
						userName: result.userName,
						userId: result.userId,
						sex: result.sex,
						head: result.head
					}
				})
			}else {
				res.send({
					code: 0,
					msg: '用户名或密码错误'
				})
			}
		}else {
			res.send({
				code: 0,
				msg: 'login fail'
			})
		}
	})
}

exports.register = (req, res) => {
	proxy.user.register(req, (data, err, result) => {
		if(!err) {
			let token = jwt.encode({
				userId: req.body.userId
			}, app.key)
			res.cookie('access_token',token, {
				maxAge: 31536000000,
				httpOnly: true
			})
			res.send({
				code: 1,
				msg: 'register successful',
				user: {
					userName: data.userName,
					userId: data.userId,
					sex: data.sex,
					head: data.head
				}
			})
		}else {
			res.send({
				code: 0,
				msg: 'register fail'
			})
		}
	})
}

exports.getGroupList = (req, res) => {
	proxy.grouplist.getGroupList(res.locals.decode, (err, result) => {
		if(!err) {
			res.send({
				code: 1,
				grouplist: result
			})
		}else {
			res.send({
				code: 0,
				msg: 'get groupList fail'
			})
		}
	})
}

exports.getContactList = (req, res) => {
	proxy.grouplist.getContactList(res.locals.decode, (err, result) => {
		if(!err) {
			res.send({
				code: 1,
				contactList: result
			})
		}else {
			res.send({
				code: 0,
				msg: 'get getContactList fail'
			})
		}
	})
}

exports.search = (req, res) => {
	var data = {
		query: req.query,
		userId: res.locals.decode
	}
	proxy.user.search(data, (err, result) => {
		if(!err) {
			res.send({
				code: 0,
				result: result
			})
		}else {
			res.send({
				code: 1,
				msg: 'search fail'
			})
		}
	})
}

exports.addFriend = (req, res) => {
	proxy.user.addFriend({
		addUser: res.locals.decode,
		addedUser: req.body
	}, (err, result) => {
		if(!err) {
			res.send({
				code: 1,
				msg: 'add successfully'
			})
		}else {
			res.send({
				code: 0,
				msg: 'add fail'
			})
		}
	})
}

exports.changePerMes = (req, res) => {
	proxy.user.changePerMes({
		changeMes: req.body,
		user: res.locals.decode
	}, (err,result) => {
		if(!err) {
			res.send({
				code: 1,
				msg: 'save successfully'
			})
		}else {
			res.send({
				code: 0,
				msg: 'save fail'
			})
		}
	})
}

/**
 * 获取最近聊天列表
 * @type {[type]}
 */
exports.getChatList = (req, res) => {
	proxy.recent.getChatList(res.locals.decode, (err, result) => {
		if(!err) {
			res.send({
				code: 1,
				chatList: result
			})
		}else {
			res.send({
				code: 0,
				msg: 'get getChatList fail'
			})
		}
	})
}

exports.updateRecentMes = (req, res, data) => {
	proxy.recent.updateRecentMes({
		from: res && res.locals.decode.userId || data.from,
		to: req && req.body.to || data.to,
		mes: data.mes || null,
		fromHead: req && req.body.fromHead || data.fromHead,
		toHead: req && req.body.toHead || data.toHead,
		fromName: req && req.body.fromName || data.fromName,
		toName: req && req.body.toName || data.toName
	}, (err, result) => {
		if(!err) {
			res && res.send({
				code: 1,
				msg: 'update successfully'
			})
		}else {
			res && res.send({
				code: 0,
				msg: 'update fail'
			})
		}
	})
}