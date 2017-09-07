let mongo = require('mongoose');
var Schema = mongo.Schema;

var groupSchema = new Schema({
	userName: String,
	groupName: String,
	groupStatus: Boolean,
	groupList: Array
})

var group = mongo.model('group', groupSchema)

module.exports = group