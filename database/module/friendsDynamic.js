let mongo = require('mongoose');
var Schema = mongo.Schema;

var friendDynamicSchema = new Schema({
    user: {
        type: String,
        ref: 'user'
    },
    mes: String,
    imgList: {
        type: Array,
        default: []
    },
    favour: [{
        user: {
            type: String,
            ref: 'user'
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    comment: [{
        user: {
            type: String,
            ref: 'user'
        },
        date: {
            type: Date,
            default: Date.now
        },
        mes: String
    }],
    date: {
        type: Date,
        default: Date.now
    },
})

var friendDynamic = mongo.model('friendDynamic', friendDynamicSchema)

module.exports = friendDynamic