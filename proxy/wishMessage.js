let Module = require('../database/module');

exports.getMessageList = function(userId, callback) {
    Module.wishMessage.find({
        user: userId
    })
    .exec(callback)
}