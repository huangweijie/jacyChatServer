let mongo = require('mongoose');
var Schema = mongo.Schema;

var userSchema = new Schema({
	userId: String,
	userName: String,
	password: String
})

var user = mongo.model('user', userSchema)

module.exports = user