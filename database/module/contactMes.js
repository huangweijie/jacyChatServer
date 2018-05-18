let mongo = require('mongoose');
var Schema = mongo.Schema;

var contactMesSchema = new Schema({
    sendUser: {
        type: String,
        ref: 'user'
    },
    getUser: {
        type: String,
        ref: 'user'
    },
    mes: String,
    date: {
        type: Date,
        default: Date.now
    },
})

var contactMes = mongo.model('contactMes', contactMesSchema)

module.exports = contactMes;