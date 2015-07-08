var server = require("http").createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end("hello world\n");
}).listen(3000);
console.log("listener in port 3000");

var Hello =  require("./hello.js");
var hello = new Hello();
hello.setName("johnson");
hello.sayHello("world");


var EventEmitter = require("events").EventEmitter;
var event = new EventEmitter();
event.on("sendEvent", function(data) {
    console.log(data);
});


setTimeout(function() {
    event.emit("sendEvent", "helloworld")
}, 1000);

var search = require('./search.js');
search.search("何桥", 'product', function (err, response) {
    console.log(response);
});