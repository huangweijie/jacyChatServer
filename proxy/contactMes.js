let Module = require('../database/module')

exports.updateContactMes = (data) => {
    let newContactMes = new Module.contactMes({
        sendUser: data.from,
        getUser: data.to,
        mes: data.mes
    })
    newContactMes.save();
}

exports.getContactMes = (data, callback) => {
    Module.contactMes.find({
        $or: [{
            sendUser: data.user1,
            getUser: data.user2
        }, {
            sendUser: data.user2,
            getUser: data.user1
        }]
    })
    .populate('getUser sendUser')
    .exec(callback);
}