let Module = require('../database/module');

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

exports.pubWish = function(data, callback) {
    let form = new formidable.IncomingForm();
    form.uploadDir = './public/';
    var wishData;
    form.parse(data, function(err, fields, files) {
        wishData = fields;
        if (files.wishImg) {
            var name = rename(files.wishImg.path, files.wishImg.name, 'wish');
            wishData.wishImg = host + 'wish/' + name;
        } else {
            wishData.wishImg = 'null';
        };

        console.log(wishData)
        let newWish = new Module.wish({
            user: wishData.userId,
            wishText: wishData.wishText,
            wishType: wishData.wishType,
            wishImg: wishData.wishImg
        })
        newWish.save(callback)
    })
}

exports.getWishList = function(callback) {
    Module.wish.find({
        wishStatus: 0
    })
    .populate('user')
    .exec(callback)
}

exports.searchWish = function(data, callback) {
    if(data.value) {
        Module.wish.find({
            wishStatus: 0,
            $or: [{
                user: {
                    $regex: data.value,
                    $options: 'i'
                }
            }, {
                wishText: {
                    $regex: data.value,
                    $options: 'i'
                }
            }]
        })
        .populate('user')
        .exec(callback)
    }else if(data.type){
        Module.wish.find({
            wishStatus: 0,
            wishType: data.type
        })
        .populate('user')
        .exec(callback)
    }
}

exports.getMyWishList = function(userId, callback) {
    Module.wish.find({
        user: userId
    })
    .populate('user')
    .exec(callback)
}

exports.getWish = function(data, callback) {
    Module.wish.findOneAndUpdate({
        _id: data.wish,
        wishStatus: 0
    }, {
        wishStatus: 1,
        getUser: data.getUser
    })
    .exec((err, result) => {
        let newMessage = new Module.wishMessage({
            mes: '你的愿望已经被领取啦！快去瞧一瞧吧。',
            user: result.user
        });
        newMessage.save(callback);
    })
}