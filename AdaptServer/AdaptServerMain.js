// 主要职责.分配ID.路由登陆.负载平衡网关.
// 启动服务器时候.先启动该服务器.之后其他的服都会请求该分配服.分配端口号之类的操作.

var tcp = require("../LighterWebEngine/TCP");
var ws = require("../LighterWebEngine/WebSocket");
var cfg = require("../Common/Config");
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
        console.log("Init");
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
    }
);

function GateWay_GetUUID(hSocket){
    var iUUID = uuid.G_UUID();
    var iPORT = uuid.G_PORT() + cfg.GateWayServerPort;

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
};


//////////////////////////////////////////////
//ws服务器流程
ws.CreateServer(cfg.AdaptServerPort_WS,
    function () {

    },

    function (hSocket, oPacket) {
        switch(oPacket.MM) {
            case "publish":
                var sPacket = {};
                sPacket.MM = "publish";
                sPacket.Text = oPacket.Text;
                ws.SendBuffer(hSocket, JSON.stringify(oPacket));
                break;
        }
    },

    function (reasonCode, description) {

    }
);

