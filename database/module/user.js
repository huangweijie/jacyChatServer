let mongo = require('mongoose');
var Schema = mongo.Schema;

var userSchema = new Schema({
	_id: String,
	userName: String,
	userId: {
		type: String,
		unique: true
	},
	password: String,
	friendList: Array,
	head: {
		type: String,
		default: ''
	},
	sex: {
		type: Number,
		default: 0
	}
})

var user = mongo.model('user', userSchema)

module.exports = user