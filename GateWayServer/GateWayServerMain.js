var tcp = require("../LighterWebEngine/TCP");
var ws = require("../LighterWebEngine/WebSocket");
var cfg = require("../Common/Config");

/////////////////////////////////////////////////////////
// 向AdapterServer请求UUID和端口号
var hASSocket = tcp.CreateClient(cfg.AdaptServerPort, "", function(){}, function(sBuffer){
    var oPacket = JSON.parse(sBuffer);
    switch(oPacket.MM){
        case "GW_GetUuidPort":
            var iPORT = parseInt(oPacket.PORT);
            var iUUID = parseInt(oPacket.UUID);
            RunServer(iPORT, iUUID);
            break;
    };
});

var sPacket = {};
sPacket["MM"] = "GW_GetUuidPort"; //请求UUID Port
tcp.SendBuffer(hASSocket, JSON.stringify(sPacket));

/////////////////////////////////////////////////////////
// 服务器启动完成.监听消息
var G_GateWay = null;
var G_HallSocket = null;
var G_ClientNumber = 0;
var G_ClientUUID = 0;
var G_PoolClientSocket = {};

function RunServer(iPORT, iUUID) {
    console.log(iPORT);

    G_GateWay = ws.CreateServer(iPORT,
        function() {
            console.log("GateWay Init Success!");
            sPacket = {};
            sPacket.MM = "GW_RegGateWay"; //客户端自动连接网关操作
            sPacket.IP = G_GateWay.address().address;
            sPacket.Port = G_GateWay.address().port;
            tcp.SendBuffer(hASSocket,JSON.stringify(sPacket));

            G_GateWay.UUID = iUUID;
            G_GateWay.PORT = iPORT;

            //连接大厅
            G_HallSocket = tcp.CreateClient(cfg.HallServerPort, cfg.HallServerPort,
                function() {

                },

                function(sBuffer) {

                }
            );
        },

        function(hSocket, sBuffer) {
            if(G_HallSocket == null){
                console.log("没有连接到大厅服务!");
                return;
            }

            tcp.SendBuffer(G_HallSocket,sBuffer);
            console.log(sBuffer);
        },

        function(hSocket, reasonCode, description) {
            console.log("close");
            G_ClientNumber --;
            delete G_PoolClientSocket[hSocket.UUID];
        },

        function(hSocket) {
            console.log("new socket");
            G_ClientNumber ++;
            G_ClientUUID++;
            hSocket.UUID = G_GateWay.UUID * 10000 + G_ClientUUID;
            G_PoolClientSocket[hSocket.UUID] = hSocket;
            console.log("new socket 网关客户数:" + G_ClientNumber + " UUID:" + hSocket.UUID);
        }
    );
};