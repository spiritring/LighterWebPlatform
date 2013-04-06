"use strict";

var websocket = require('websocket');
var http = require('http');
var util = require('util');

exports.createServer = function(port, maxFrameSize) {
    var httpServer = http.createServer();

    httpServer.on('listening', function() {

    });

    var wsServer = new websocket.server({
        httpServer: httpServer,
        maxReceivedMessageSize: maxFrameSize
    });

    wsServer.on('request', function(request) {
        var connection = request.accept(null, request.origin);

        connection.on('message', function(message) {
            var parsed = JSON.parse(message.utf8Data);
            switch (parsed.type) {
                case 'publish':
                    connection.sendUTF(JSON.stringify(parsed));
                    break;
            }
        });

        connection.on('close', function(reasonCode, description) {

        });
    });

    httpServer.listen(port);

    return httpServer;
};

exports.createServer(8155, 10000);