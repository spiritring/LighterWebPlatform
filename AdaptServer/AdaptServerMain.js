// 主要职责.分配ID.路由登陆.负载平衡网关.
// 启动服务器时候.先启动该服务器.之后其他的服都会请求该分配服.分配端口号之类的操作.

var tcp = require("../LighterWebEngine/TCP");
var ws = require("../LighterWebEngine/WebSocket");
var cfg = require("../Common/Config");
var util = require("../Common/TSUtil");
var uuid = require("../LighterWebEngine/UUID");

//网关池.用来分析.玩家与哪个网关相连
var Pool_GateWay = [];
function CGateWay(Port, IP, Socket) {
    this.Port = Port;
    this.IP = IP;
    this.Socket = Socket;
};

tcp.CreateServer(cfg.AdaptServerPort,
    function() {
        console.log("Timeshift AdaptTCPServer Success!");
    },

    function(hSocket, sBuffer) {
        var oPacket = JSON.parse(sBuffer);
        switch (oPacket.MM) {
            case "GW_GetUuidPort":
                GateWay_GetUUID(hSocket);
                break;
            case "GW_RegGateWay":
                GateWay_RegGateWay(hSocket, oPacket);
                break;
        };
    },

    function(hSocket) {
        var UID = uuid.G_GetUUID(hSocket);
        uuid.G_RemoveS(hSocket);
        var iPort = 0;

        for (var i = 0 ; i < Pool_GateWay.length ; i++) {
            if (Pool_GateWay[i].Socket === hSocket) {
                iPort = Pool_GateWay[i].Port;
                Pool_GateWay.splice(i,1);
                break;
            }
        }
        console.log("Close = " + UID + " Port = " + iPort + " Length = " + Pool_GateWay.length);
    },

    function(hSocket) {

    }
);

function GateWay_GetUUID(hSocket){
    var iUUID = uuid.G_UUID();
    var iPORT = uuid.G_PORT() + cfg.GateWayServerPort;

    hSocket.UUID = iUUID;
    hSocket.PORT= iPORT;

    var sPacket = {};
    sPacket["MM"] = "GW_GetUuidPort";
    sPacket["UUID"] = iUUID;
    sPacket["PORT"] = iPORT;
    tcp.SendBuffer(hSocket, JSON.stringify(sPacket));

    uuid.G_SetSU(hSocket, iUUID);

    console.log(iPORT);
};

function GateWay_RegGateWay(hSocket, oPacket) {
    var GW = new CGateWay(oPacket.Port, oPacket.IP, hSocket);
    Pool_GateWay.push(GW);

    console.log("GateWay Regist Success! Port:" + oPacket.Port + " IP:" + oPacket.IP );
};


//////////////////////////////////////////////
//ws服务器流程
var G_ClientNumber = 0;

ws.CreateServer(cfg.AdaptServerPort_WS,
    function () {
        console.log("Timeshift AdaptWebSocketServer Success!");
    },

    function (hSocket, sBuffer) {
        var oPacket = JSON.parse(sBuffer);
        console.log(oPacket.MM);
        switch(oPacket.MM) {
            case "ConnectGateWay":
                if(Pool_GateWay.length <= 0){
                    console.log("当前没有网关开启!");
                }

                var index = (G_ClientNumber - 1) % Pool_GateWay.length;
                var GW = Pool_GateWay[index];

                var sPacket = {};
                sPacket.MM = "ConnectGateWay";
                sPacket.IP = GW.IP;
                sPacket.Port = GW.Port;
                ws.SendBuffer(hSocket, JSON.stringify(sPacket));

                break;
        }
    },

    function (hSocket, reasonCode, description) {
        G_ClientNumber --;
        console.log("客户端下线退出游戏! 人数:" + G_ClientNumber);

    },

    function (hSocket) {
        G_ClientNumber ++;
        console.log("客户端上线! 人数:" + G_ClientNumber);

    }
);

