var nodejieba = require("nodejieba");

var redis = require("redis"),
    client = redis.createClient();

var levenshtein = require('fast-levenshtein');

var crypto = require('crypto');

function md5(text) {
    return crypto.createHash('md5').update(text).digest('hex')
}

function add2Queue(item, text, dataType, correspondingId) {
    var score = levenshtein.get(item, text);
    client.zadd(dataType + ':' + md5(item), score, correspondingId);
}

function createIndex(text, dataType, correspondingId) {
    nodejieba.cut(text).forEach(function (item) {
        add2Queue(item, text, dataType, correspondingId);
    });
    text.split('').forEach(function (item) {
        add2Queue(item, text, dataType, correspondingId);
    })
}

function removeIndex(text, dataType, correspondingId) {
    nodejieba.cut(text).forEach(function (item) {
        client.zrem(dataType + ':' + md5(item), correspondingId);
    });
    text.split('').forEach(function (data) {
        client.zrem(dataType + ':' + md5(data), correspondingId);
    })
}

function search(text, dataType, callback) {
    var keys = [];
    nodejieba.cut(text).forEach(function (item) {
        keys.push(dataType + ':' + md5(item));
    });
    text.split('').forEach(function (data) {
        keys.push(dataType + ':' + md5(data));
    });

    var cmd = ["result", keys.length];
    client.zinterstore(cmd.concat(keys), function (error, resonse) {
        if (!error) {
            client.zrevrange('result', 0, -1, callback);
        }
    });
}
exports.search = search;
exports.createIndex = createIndex;
exports.removeIndex = removeIndex;
