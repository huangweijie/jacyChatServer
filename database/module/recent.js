let mongo = require('mongoose');
var Schema = mongo.Schema;

var recentSchema = new Schema({
    // belongUserId: String,
    from: {
        type: String,
        ref: 'user'
    },
    to: {
        type: String,
        ref: 'user'
    },
    mes: {
        type: String,
        default: null
    },
    updated: {
        type: Date,
        default: Date.now
    }

})

var recent = mongo.model('recent', recentSchema)

module.exports = recent;