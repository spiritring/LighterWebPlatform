var ExBuffer = require('ExBuffer');
var ByteBuffer = require('ByteBuffer');
var net = require('net');

console.log('-----------------------use in socket------------------------');

//测试服务端
var server = net.createServer(function(socket) {
    console.log('client connected');
    new Connection(socket);//有客户端连入时
});
server.listen(8124);

//服务端中映射客户端的类
function Connection(socket) {
    var exBuffer = new ExBuffer();
    exBuffer.on('data',onReceivePackData);

    socket.on('data', function(data) {
        exBuffer.put(data);//只要收到数据就往ExBuffer里面put
    });

    //当服务端收到完整的包时
    function onReceivePackData(buffer){
        console.log('>> server receive data,length:'+buffer.length);
        var bytebuf = new ByteBuffer(buffer);
        var resArr = bytebuf.uint32().string().unpack();
        console.log(resArr[0] + resArr[1]);

        var data = '12345';
        for(var i = 0 ; i < 10 ; i++)
        {
            //写入2个字节表示本次包长
            var byBuffer = new ByteBuffer();
            var buf = byBuffer.string(data).pack(true);
            socket.write(buf);
        }
    }
}