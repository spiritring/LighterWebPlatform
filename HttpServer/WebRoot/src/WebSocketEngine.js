(function (){
    // connect to the Json Messaging server and return an 'connection' object
    function connect(host, port, messageListener, errorListener) {
        window.WebSocket = window.WebSocket || window.MozWebSocket;

        if (!window.WebSocket) {
            alert('Your browser does not support WebSocket.');
            return null;
        }

        var hSocket = new WebSocket('ws://' + host + ':' + port);

        hSocket.onmessage = function(sBuffer) {
            var parsed = JSON.parse(sBuffer.data);
            messageListener(parsed);
        };

        hSocket.onclose = function(code, reason, wasClean) {
            alert("断开连接:" + reason + " Code:" + code);
            errorListener();
        };

        return hSocket;
    }

    // initialize
    WebSocketEngine = function(sIP,iPort,funInit,callbackMessage, callbackError) {
        // connect to the local server
        var connection = connect(
            sIP,
            iPort,
            // message handler
            callbackMessage,
            // error handler
            callbackError
        );

        // subscribe a topic
        connection.onopen = function() {
            funInit();
        };

        return connection;
    };

    SendBuffer = function(hSocket, sPacket) {
        hSocket.send(JSON.stringify(sPacket));
    }
}())