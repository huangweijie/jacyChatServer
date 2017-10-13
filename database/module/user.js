let mongo = require('mongoose');
var Schema = mongo.Schema;

var userSchema = new Schema({
	userId: String,
	userName: {
		type: String,
		unique: true
	},
	password: String,
	friendList: Array,
	head: {
		type: Number,
		default: 0
	}
})

var user = mongo.model('user', userSchema)

module.exports = user