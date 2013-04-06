var tcp = require("../LighterWebEngine/TCP");
var cfg = require("../Common/Config");

/////////////////////////////////////////////////////////
// 向AdapterServer请求UUID和端口号
var hASSocket = tcp.CreateClient(cfg.AdaptServerPort, "", function(){}, function(sBuffer){
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
tcp.SendBuffer(hASSocket, JSON.stringify(sPacket));

/////////////////////////////////////////////////////////
// 服务器启动完成.监听消息
var G_GateWay = null;

function RunServer(iPort) {
    console.log(iPort);

    G_GateWay = tcp.CreateServer(iPort,
        function() {
            console.log("Init");
            sPacket = {};
            sPacket.MM = "RegGateWay"; //客户端自动连接网关操作
            sPacket.IP = G_GateWay.address().address;
            sPacket.Port = G_GateWay.address().port;
            tcp.SendBuffer(hASSocket,JSON.stringify(sPacket));
        },

        function(hSocket, sBuffer) {
            console.log(sBuffer);
        },

        function(hSocket) {
            console.log("close");
        }
    );
};