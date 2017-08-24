var express = require('express')
var app = express()
var mongo = require('./database/database.js')
var bodyparser = require('body-parser')
var route = require('./route.js')

app.use('*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', '*');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
    res.header('Access-Control-Allow-Credentials','true');
    next();
})

app.use(bodyparser.json())

app.post('/login', route.login)

app.post('/register', route.register)

app.get('/getGroupList', route.getGroupList)

var server = app.listen(3000, function() {
	console.log('server is start at localhost:3000')
})


