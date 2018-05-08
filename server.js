var express = require('express')
var app = express()
var server = require('http').Server(app)
var mongo = require('./database/database.js')
var bodyparser = require('body-parser')
var route = require('./route.js')
var jwt = require('jwt-simple')
var cookieparser = require('cookie-parser')
var jwtDecode = require('./jwtDecode.js')
// var session = require('express-session')

app.use('*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', req.headers.origin);
	res.header('Access-Control-Allow-Methods', '*');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
    res.header('Access-Control-Allow-Credentials','true');
    next();
})

app.use(bodyparser.json())
app.use(cookieparser())
// app.use(session({
// 	secret: 'jacyhuang',
// 	resave: true,
// 	saveUninitialized: true
// }))

app.use(express.static('public'));

//加密秘钥
app.set('jwtTokenSecret', 'jacyhuang')

app.post('/login', route.login)

app.post('/register', route.register)

app.get('/getGroupList', [jwtDecode], route.getGroupList)

app.get('/getChatList', [jwtDecode], route.getChatList)

app.get('/getContactList', [jwtDecode], route.getContactList)

app.get('/search', [jwtDecode], route.search)

app.post('/addFriend', [jwtDecode], route.addFriend)

app.post('/changePerMes', [jwtDecode], route.changePerMes)

app.post('/updateRecentMes', [jwtDecode], route.updateRecentMes)




var server = app.listen(3000, function() {
	console.log('server is start at localhost:3000')
})






var io = require('socket.io')(server)

let socketArr = {};
io.on('connection', (socket) => {
	socket.on('message', (data) => {
		socketArr[data] = socket.id;
	})
	socket.on('send', (data) => {
		// console.log(data)
		// console.log(socketArr[data.to])
		socket.emit('to' + data.to, data.mes);
		socket.to(socketArr[data.to]).emit('to' + data.to, data.mes, data.from, data.fromName);
		//更新消息记录
		//更新最近联系
		route.updateRecentMes(null, null, data);
	})
	socket.on('disconnect', (reason) => {
		console.log('connect close:', reason)
	})
})

exports.key = app.get('jwtTokenSecret');