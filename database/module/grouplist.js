let mongo = require('mongoose');
var Schema = mongo.Schema;

var groupSchema = new Schema({
	userId: String,
	groupName: String,
	groupStatus: Boolean,
	groupList: Array,
    mes: {
        type: String,
        default: null
    }
})

var group = mongo.model('group', groupSchema)

module.exports = group