"use strict";
var net = require('net');

var createServer = function(port, maxFrameSize) {
    var tcpServer = net.createServer();
    tcpServer.on('listening', function() {

    });

    tcpServer.on('connection', function(socket) {
        socket.setEncoding('utf8');
        socket.setKeepAlive(true);

        socket.on('data', function(data) {
            console.log("data---------------------------");
            console.log(data);
        });
        socket.on('close', function() {
            console.log('close');
        });
    });

    tcpServer.on('error', function(exception) {
        tcpServer.close();
    });

    tcpServer.on('close', function() {
    });

    tcpServer.listen(port);

    return tcpServer;
};

createServer(8421,120);
