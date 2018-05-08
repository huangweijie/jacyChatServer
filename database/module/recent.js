let mongo = require('mongoose');
var Schema = mongo.Schema;

var recentSchema = new Schema({
    // belongUserId: String,
    from: String,
    fromHead: String,
    to: String,
    toHead: String,
    fromName: String,
    toName: String,
    mes: {
        type: String,
        default: null
    },
    updated: {
        type: Date,
        default: +new Date
    }

})

var recent = mongo.model('recent', recentSchema)

module.exports = recent;