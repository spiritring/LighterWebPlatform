var ExBuffer = require('ExBuffer');
var ByteBuffer = require('ByteBuffer');
var net = require('net');

var exBuffer = new ExBuffer();
var client = net.connect(8124, function() {
    var data = '12345';

    //写入2个字节表示本次包长
    var byBuffer = new ByteBuffer();
    var buf = byBuffer.uint32(12345).string(data).pack(true);
    client.write(buf);
});

client.on('data', function(data) {
    console.log("data-----------------------------------------------------------");
    exBuffer.put(data);//只要收到数据就往ExBuffer里面put
});

//当客户端收到完整的数据包时
exBuffer.on('data', function(buffer) {
    console.log('>> client receive data,length:'+buffer.length);
    var bytebuf = new ByteBuffer(buffer);
    var resArr = bytebuf.string().unpack();
    console.log(resArr[0]);
});