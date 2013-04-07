(function (){
    // connect to the Json Messaging server and return an 'connection' object
    function connect(host, port, messageListener, errorListener) {
        window.WebSocket = window.WebSocket || window.MozWebSocket;

        if (!window.WebSocket) {
            alert('Your browser does not support WebSocket.');
            return null;
        }

        var connection = new WebSocket('ws://' + host + ':' + port);

        connection.onmessage = function(message) {
            try {
                var parsed = JSON.parse(message.data);
                switch (parsed.type) {
                    case 'publish':
                        if (messageListener) {
                            messageListener(parsed);
                        }
                        break;
                    case 'error':
                        if (errorListener) {
                            errorListener(parsed);
                        }
                        break;
                    default:
                        throw new Error('Unknown message type ' + parsed.type);
                        break;
                }
            } catch (e) {
                console.warn(e);
                alert(e);
            }
        };

        connection.publish = function(destination, x, y) {
            connection.send(JSON.stringify({
                type: 'publish',
                destination: destination,
                xx: x,
                yy: y
            }));
        };

        connection.subscribe = function(destination) {
            connection.send(JSON.stringify({
                type: 'subscribe',
                destination: destination
            }));
        };

        connection.unsubscribe = function(destination) {
            connection.send(JSON.stringify({
                type: 'unsubscribe',
                destination: destination
            }));
        };

        return connection;
    }

    // initialize
    WebSocketEngine = function(callbackMessage, callbackError) {
        // connect to the local server
        var connection = connect(
            'localhost',
            8155,
            // message handler
            callbackMessage,
            // error handler
            callbackError
        );

        // subscribe a topic
        connection.onopen = function() {
            connection.subscribe('TSClient');
        };

        return connection;
    };
}())