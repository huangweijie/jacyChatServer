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
		console.log(data,err,result)
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
		mes: data.mes || null
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

exports.pubWish = (req, res) => {
	proxy.wish.pubWish(req, (err, result) => {
		if(!err) {
			res.send({
				code: 1,
				msg: 'publish successfully'
			})
		}else {
			res.send({
				code: 0,
				msg: 'publish fail'
			})
		}
	})
}

exports.getWishList = (req, res) => {
	proxy.wish.getWishList((err, result) => {
		if(!err) {
			res.send({
				code: 1,
				wishList: result
			})
		}else {
			console.log(err)
			res.send({
				code: 0,
				msg: 'getWishList fail'
			})
		}
	})
}

exports.searchWish = (req, res) => {
	proxy.wish.searchWish(req.query, (err, result) => {
		if(!err) {
			res.send({
				code: 1,
				wishList: result
			})
		}else {
			console.log(err)
			res.send({
				code: 0,
				msg: 'searchWishList fail'
			})
		}
	})
}

exports.getMessageList = (req, res) => {
	proxy.wishMessage.getMessageList(res.locals.decode.userId, (err, result) => {
		if(!err) {
			res.send({
				code: 1,
				messageList: result
			})
		}else {
			console.log(err)
			res.send({
				code: 0,
				msg: 'get messageList fail'
			})
		}
	})
}

exports.getMyWishList = (req, res) => {
	proxy.wish.getMyWishList(res.locals.decode.userId, (err, result) => {
		if(!err) {
			res.send({
				code: 1,
				wishList: result
			})
		}else {
			console.log(err)
			res.send({
				code: 0,
				msg: 'getMyWishList fail'
			})
		}
	})
}

exports.getWish = (req, res) => {
	proxy.wish.getWish({
		getUser: res.locals.decode.userId,
		wish: req.body.wish
	}, (err, result) => {
		if(!err) {
			res.send({
				code: 1,
				msg: 'getWish successful'
			})
		}else {
			res.send({
				code: 0,
				msg: 'getWish fail'
			})
		}
	})
}

exports.updateContactMes = (data) => {
	proxy.contactMes.updateContactMes(data);
}

exports.getContactMes = (req, res) => {
	proxy.contactMes.getContactMes({
		user1: res.locals.decode.userId,
		user2: req.query.contactId
	}, (err, result) => {
		if(!err) {
			res.send({
				code: 1,
				contactMesList: result
			})
		}else {
			res.send({
				code: 0,
				msg: 'getContactMes fail'
			})
		}
	})
}

exports.pushFriendDy = (req, res) => {
	proxy.friendDynamic.pushFriendDy(req, res.locals.decode.userId, (err, result) => {
		if(!err) {
			res.send({
				code: 1,
				msg: 'pushFriendDy successful'
			})
		}else {
			res.send({
				code: 0,
				msg: 'pushFriendDy fail'
			})
		}
	})
}

exports.getFriendDy = (req, res) => {
	proxy.friendDynamic.getFriendDy(res.locals.decode.userId, (err, result) => {
		if(!err) {
			res.send({
				code: 1,
				friendDynamicList: result
			})
		}else {
			res.send({
				code: 0,
				msg: 'getFriendDy fail'
			})
		}
	})
}

exports.favour = (req, res) => {
	proxy.friendDynamic.favour({
		userId: res.locals.decode.userId,
		_id: req.body._id
	}, (err, result) => {
		if(!err) {
			res.send({
				code: 1,
				msg: 'favour successful'
			})
		}else {
			res.send({
				code: 0,
				msg: 'favour fail'
			})
		}
	})
}

exports.unfavour = (req, res) => {
	proxy.friendDynamic.unfavour({
		userId: res.locals.decode.userId,
		_id: req.body._id
	}, (err, result) => {
		if(!err) {
			res.send({
				code: 1,
				msg: 'unfavour successful'
			})
		}else {
			res.send({
				code: 0,
				msg: 'unfavour fail'
			})
		}
	})
}

exports.pushComment = (req, res) => {
	proxy.friendDynamic.pushComment({
		userId: res.locals.decode.userId,
		_id: req.body._id,
		mes: req.body.mes
	}, (err, callback) => {
		if(!err) {
			res.send({
				code: 1,
				msg: 'pushComment successful'
			})
		}else {
			res.send({
				code: 0,
				msg: 'pushComment fail'
			})
		}
	})
}