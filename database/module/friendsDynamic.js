let mongo = require('mongoose');
var Schema = mongo.Schema;

var allSchema = require('./index');

var friendDynamicSchema = new Schema({
    userId: String,
    mes: String,
    imgList: {
        type: Array,
        default: []
    },
    favour: [{
        user: {
            type: String,
            ref: allSchema.userModule
        },
        date: {
            type: Date,
            default: +new Date
        }
    }],
    comment: [{
        user: {
            type: String,
            ref: allSchema.userModule
        },
        date: {
            type: Date,
            default: +new Date
        },
        mes: String
    }],
    date: {
        type: Date,
        default: +new Date
    },
})

var friendDynamic = mongo.model('friendDynamic', friendDynamicSchema)

module.exports = friendDynamic