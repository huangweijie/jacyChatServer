let mongo = require('mongoose');
let url = 'mongodb://localhost/jacyChat';
let db;

mongo.Promise = global.Promise;
mongo.connect(url, {
	useMongoClient: true, 
}, function(err, database) {
	if(!err) {
		console.log('connect successful!')
		db = database;
	}else {
		console.log(err)
	}
})

exports.mongo = mongo;
exports.db = db;