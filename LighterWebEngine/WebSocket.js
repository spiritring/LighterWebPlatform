"use strict";

var websocket = require('websocket');
var http = require('http');

function CreateServer(port, funInit, funReceive, funClose) {
    var httpServer = http.createServer();

    httpServer.on('listening', function() {
        funInit();
    });

    var wsServer = new websocket.server({
        httpServer: httpServer,
        maxReceivedMessageSize: 100000
    });

    wsServer.on('request', function(request) {
        var hSocket = request.accept(null, request.origin);

        hSocket.on('message', function(message) {
            var oPacket = JSON.parse(message.utf8Data);
            funReceive(hSocket, oPacket);
        });

        hSocket.on('close', function(reasonCode, description) {
            funClose(reasonCode, description);
        });
    });

    httpServer.listen(port);

    return httpServer;
};

function SendBuffer(hSocket, sBuffer) {
    hSocket.sendUTF(sBuffer);
}

module.exports = {
    SendBuffer: SendBuffer,
    CreateServer: CreateServer
};