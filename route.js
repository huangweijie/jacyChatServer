var proxy = require('./proxy')
var app = require('./server')
var jwt = require('jwt-simple')


exports.login = (req, res) => {
	proxy.user.login(req.body, (err, result) => {
		if(!err) {
			if(result) {
				let token = jwt.encode({
					userName: result.userName
				}, app.key)
				res.cookie('access_token',token, {
					maxAge: 31536000000,
					httpOnly: true
				})
				res.send({
					code: 1,
					msg: 'login successful',
					user: result.userId,
					head: result.head
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
	proxy.user.register(req.body, (err, result) => {
		if(!err) {
			let token = jwt.encode({
				userName: req.body.username
			}, app.key)
			res.cookie('access_token',token, {
				maxAge: 31536000000,
				httpOnly: true
			})
			res.send({
				code: 1,
				msg: 'register successful'
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

exports.search = (req, res) => {
	var data = {
		query: req.query,
		userName: res.locals.decode
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

exports.updateRecent = (req, res) => {
	proxy.user.updateRecent({
		addUser: res.locals.decode,
		addedUser: req.body
	}, (err, result) => {
		if(!err) {
			res.send({
				code: 1,
				msg: 'update successfully'
			})
		}else {
			res.send({
				code: 0,
				msg: 'update fail'
			})
		}
	})
}