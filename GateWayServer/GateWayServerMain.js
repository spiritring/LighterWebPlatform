var tcp = require("../LighterWebEngine/TCP");
var cfg = require("../Common/Config");

/////////////////////////////////////////////////////////
// 向AdapterServer请求UUID和端口号
var hSocket = tcp.CreateClient(cfg.AdaptServerPort, "", function(){}, function(sBuffer){
    var oPacket = JSON.parse(sBuffer);
    switch(oPacket.MM){
        case "GetUuidPort":
            var iPort = parseInt(oPacket.PORT);
            RunServer(iPort);
            break;
    };
});

var sPacket = {};
sPacket["MM"] = "GetUuidPort"; //请求UUID Port
tcp.SendBuffer(hSocket, JSON.stringify(sPacket));

/////////////////////////////////////////////////////////
// 服务器启动完成.监听消息
function RunServer(iPort) {
    console.log(iPort);
    tcp.CreateServer(iPort,
        function(hSocket) {

        },

        function(hSocket, sBuffer) {
            console.log(sBuffer);
        },

        function(hSocket) {
            console.log("close");
        }
    );
}