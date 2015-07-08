var restify = require('restify');

var server = restify.createServer({
    name: 'redis-search',
    version: '1.0.0'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

var search = require('./search');

server.post('/index', function (req, res, next) {
    search.createIndex(req.params.text, req.params.dataType, req.params.correspondingId);
    return next();
});


server.post('/index/remove', function (req, res, next) {
    search.removeIndex(req.params.text, req.params.dataType, reg.params.correspondingId);
    return next();
});

server.get('/search/:dataType/:text', function (req, res, next) {
    search.search(req.params.text, req.params.dataType, function (err, response){
        res.send(response);
        return next();
    })
});


server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});
