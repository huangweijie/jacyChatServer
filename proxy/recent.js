let Module = require('../database/module')

exports.updateRecentMes = (data, callback) => {
    Module.recent.findOne({
        $or: [{
            from: data.from,
            to: data.to
        }, {
            to: data.from,
            from: data.to
        }]
    })
    .exec((err, result) => {
        if(!err) {
            if(result && data.mes == null) {
                callback();
                return;
            }
            Module.recent.update({
                from: data.from,
                to: data.to
            }, {
                mes: data.mes,
                updated: +new Date,
                fromHead: data.fromHead,
                toHead: data.toHead,
                fromName: data.fromName,
                toName: data.toName
            }, {
                upsert: true
            })
            .exec(callback)
        }else {
            console.log(err);
        }
    })
}

exports.getChatList = (data, callback) => {
    Module.recent.find({
        $or: [{
            from: data.userId
        }, {
            to: data.userId
        }]
    }, {
        _id: 0
    })
    .sort({
        updated: -1
    })
    .exec(callback)
}