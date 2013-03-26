var net = require('net');
var ExBuffer = require('Exbuffer');

var client = net.connect({port: 8421},
    function() { //'connect' listener
        console.log('client connected');
        for(var i = 0; i < 10 ; i++)
            client.write('world!'+i+'\r\n');
    });

client.on('data', function(data) {
    console.log('data');

});

client.on('end', function() {
    console.log('client disconnected');
});
