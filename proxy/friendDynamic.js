let Module = require('../database/module')

let formidable = require('formidable');
let fs = require('fs');

const host = 'http://localhost:3000/';

function rename(old, _new, code, bId) {
    var path = './public/' + code + '/';
    if (fs.existsSync(path)) {
        _new = _new.split('.');
        name = _new[0] + new Date().getTime() + '.' + _new[1];
        fs.renameSync(old, path + name);
    } else {
        fs.mkdir(path);
        _new = _new.split('.');
        name = _new[0] + new Date().getTime() + '.' + _new[1];
        fs.renameSync(old, path + name);
    }
    return name;
}

exports.pushFriendDy = (data, user, callback) => {
    let form = new formidable.IncomingForm();
    form.multiples = true;
    form.uploadDir = './public/';
    var friendDynamicData;
    form.parse(data, function(err, fields, files) {
        friendDynamicData = fields;
        friendDynamicData.imgList = [];
        if (files.imgList) {
            if(files.imgList.length) {
                files.imgList.forEach((value, index) => {
                    let name = rename(value.path, value.name, 'friendDynamicImg');
                    friendDynamicData.imgList.push(host + 'friendDynamicImg/' + name);
                })
            }else {
                let name = rename(files.imgList.path, files.imgList.name, 'friendDynamicImg');
                friendDynamicData.imgList.push(host + 'friendDynamicImg/' + name);
            }
        }
        let newFriendDynamic = new Module.friendDynamic({
            user: user,
            imgList: friendDynamicData.imgList,
            mes: friendDynamicData.mes
        })
        newFriendDynamic.save(callback);
    })
}

exports.getFriendDy = (user, callback) => {
    Module.userModule.findOne({
        userId: user
    })
    .exec((err, result) => {
        if(!err) {
            let friendList = result.friendList;
            Module.friendDynamic.find({
                $or: [{
                    user: {
                        '$in': friendList 
                    }
                }, {
                    user: user
                }]
            })
            .populate('user comment.user favour.user')
            .sort({
                date: -1
            })
            .exec(callback)
        }else {
            callback(err);
        }
    })
}

exports.favour = (data, callback) => {
    Module.friendDynamic.update({
        _id: data._id
    }, {
        '$addToSet': {
            favour: {
                user: data.userId
            }
        }
    })
    .exec(callback)
}

exports.unfavour = (data, callback) => {
    Module.friendDynamic.update({
        _id: data._id
    }, {
        '$pull': {
            favour: {
                user: data.userId
            }
        }
    })
    .exec(callback)
}

exports.pushComment = (data, callback) => {
    Module.friendDynamic.update({
        _id: data._id
    }, {
        '$addToSet': {
            comment: {
                user: data.userId,
                mes: data.mes
            }
        }
    })
    .exec(callback)
}