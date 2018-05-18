let mongo = require('mongoose');
var Schema = mongo.Schema;

var wishSchema = new Schema({
    user: {
        type: String,
        ref: 'user'
    },
    wishText: String,
    wishType: Number,
    wishImg: String,
    wishStatus: {
        type: Number,
        default: 0
    },
    getUser: {
        type: String,
        ref: 'user',
        default: null
    },
    date: {
        type: Date,
        default: Date.now
    }
})

var wish = mongo.model('wish', wishSchema)

module.exports = wish