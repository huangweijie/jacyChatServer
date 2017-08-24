var proxy = require('./proxy')

exports.login = (req, res) => {
	proxy.user.login(req.body, function(err, result) {
		if(!err) {
			if(result) {
				res.send({
					code: 1,
					msg: 'login successful'
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
	proxy.user.register(req.body, function(err, result) {
		if(!err) {
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
	res.send({
		code: 1
	})
}