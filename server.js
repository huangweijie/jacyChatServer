var express = require('express');
var app = express();

app.use('*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', '*');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
    res.header('Access-Control-Allow-Credentials','true');
    next();
})

app.post('/login', function(req, res) {
	res.send({
		code: 1
	})
})
app.get('/getGroupList', function(req, res) {
	res.send({
		code: 1
	})
})

var server = app.listen(3000, function() {
	console.log('server is start at localhost:3000')
})