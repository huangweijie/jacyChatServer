var express = require('express')
var app = express()
var server = require('http').Server(app)
var mongo = require('./database/database.js')
var bodyparser = require('body-parser')
var route = require('./route.js')
var jwt = require('jwt-simple')
var cookieparser = require('cookie-parser')
var jwtDecode = require('./jwtDecode.js')

app.use('*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', req.headers.origin);
	res.header('Access-Control-Allow-Methods', '*');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
    res.header('Access-Control-Allow-Credentials','true');
    next();
})

app.use(bodyparser.json())
app.use(cookieparser())

//加密秘钥
app.set('jwtTokenSecret', 'jacyhuang')

app.post('/login', route.login)

app.post('/register', route.register)

app.get('/getGroupList', [jwtDecode], route.getGroupList)

app.get('/search', [jwtDecode], route.search)

app.post('/addFriend', [jwtDecode], route.addFriend)




var server = app.listen(3000, function() {
	console.log('server is start at localhost:3000')
})






var io = require('socket.io')(server)

io.on('connection', (socket) => {
	socket.emit('news', {
		hello: 'world'
	});
	socket.on('my other event', (data) => {
		console.log(data);
	})
	socket.on('disconnect', (reason) => {
		console.log('connect close:', reason)
	})
})

exports.key = app.get('jwtTokenSecret');