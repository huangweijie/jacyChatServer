let mongo = require('mongoose');
var Schema = mongo.Schema;

var wishMesSchema = new Schema({
    user: {
        type: String,
        ref: 'user'
    },
    mes: String,
    date: {
        type: Date,
        default: Date.now
    }
})

var wishMessage = mongo.model('wishMessage', wishMesSchema)

module.exports = wishMessage