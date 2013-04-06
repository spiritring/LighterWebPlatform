var ExBuffer = require('ExBuffer');
var ByteBuffer = require('ByteBuffer');
var net = require('net');

function CreateServer(iPort, funReceive) {
    var server = net.createServer(function(hSocket) {
        // 粘包
        var exBuffer = new ExBuffer();
        exBuffer.on('data', function(hBuffer){
            var bytebuf = new ByteBuffer(hBuffer);
            var resArr = bytebuf.string().unpack();
            funReceive(hSocket, resArr[0]);
        });

        // 监听收包
        hSocket.on('data', function(data) {
            exBuffer.put(data);
        });
    });
    server.listen(iPort);
    return server;
};

function SendBuffer(hSocket, sBuffer) {
    var byBuffer = new ByteBuffer();
    var buf = byBuffer.string(sBuffer).pack(true);
    hSocket.write(buf);
};


function CreateClient(iPort, sHost, funInit, funReceive) {

    if(sHost = "") {
        sHost = "127.0.0.1";
    }

    var exBuffer = new ExBuffer();
    var hSocket = net.connect(iPort, sHost, function() {
        funInit();
    });

    hSocket.on('data', function(data) {
        exBuffer.put(data);
    });

    //当客户端收到完整的数据包时
    exBuffer.on('data', function(buffer) {
        var bytebuf = new ByteBuffer(buffer);
        var resArr = bytebuf.string().unpack();
        funReceive(resArr[0]);
    });

    return hSocket;
}


module.exports = {
    CreateServer: CreateServer,
    CreateClient: CreateClient,
    SendBuffer: SendBuffer
};





