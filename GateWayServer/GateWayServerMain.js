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
            RunServer_WS(iPORT, iUUID);
            RunServer(iPORT%10000+10000, iUUID);
            break;
        case "HS_ConnectHall":
            //重新连接大厅
            console.log("重新连接大厅. 成功!");
            G_HallSocket = tcp.CreateClient(cfg.HallServerPort, cfg.HallServerIP,
                HallConnectSuccess,
                HallMessageRoute
            );
            break;
    };
});

var sPacket = {};
sPacket["MM"] = "GW_GetUuidPort"; //请求UUID Port
tcp.SendBuffer(hASSocket, JSON.stringify(sPacket));

/////////////////////////////////////////////////////////
// ws服务器启动完成.监听消息
var G_GateWay = null;
var G_HallSocket = null;
var G_GateWayTCP = null;

var G_ClientNumber = 0;
var G_ClientUUID = 0;
var G_PoolClientSocket = {};

function RunServer_WS(iPORT, iUUID) {
    // 创建客户端服务器
    G_GateWay = ws.CreateServer(iPORT,
        function() {
            console.log("GateWay WebSocket Init Success! Port:" + iPORT + " UUID:" + iUUID);
            sPacket = {};
            sPacket.MM = "GW_RegGateWay"; //客户端自动连接网关操作
            sPacket.IP = G_GateWay.address().address;
            sPacket.Port = G_GateWay.address().port;
            tcp.SendBuffer(hASSocket,JSON.stringify(sPacket));

            G_GateWay.UUID = iUUID;
            G_GateWay.PORT = G_GateWay.address().port;
            G_GateWay.IP = G_GateWay.address().address;

            //连接大厅
            G_HallSocket = tcp.CreateClient(cfg.HallServerPort, cfg.HallServerIP,
                HallConnectSuccess,
                HallMessageRoute
            );
        },

        // 客户端消息转发: 如果玩家在大厅.则转发到大厅. 如果玩家在游戏.则转发到游戏服
        function(hSocket, sBuffer) {

            // 通过hSocket.UUID 找对应的Game服Socket.然后把数据转发过去.



            if(G_HallSocket == null){
                console.log("没有连接到大厅服务!");
                return;
            }
            var oPacket = JSON.parse(sBuffer);
            oPacket.UUID = hSocket.UUID;
            tcp.SendBuffer(G_HallSocket,JSON.stringify(oPacket));
        },

        // 客户端断开连接操作:  通知大厅玩家下线
        function(hSocket, reasonCode, description) {
            G_ClientNumber --;
            delete G_PoolClientSocket[hSocket.UUID];
            console.log("close 网关客户数:" + G_ClientNumber + " UUID:" + hSocket.UUID);

            var sPacket = {
                MM:"ClientOffLine",
                UUID:hSocket.UUID
            };
            tcp.SendBuffer(G_HallSocket,JSON.stringify(sPacket));
        },

        // 客户端登陆成功.分配UUID给客户端.
        function(hSocket) {
            G_ClientNumber ++;
            G_ClientUUID++;
            hSocket.UUID = G_ClientUUID * 1000 + G_GateWay.UUID;
            G_PoolClientSocket[hSocket.UUID] = hSocket;
            console.log("newSocket 网关客户数:" + G_ClientNumber + " UUID:" + hSocket.UUID);
        }
    );
};

function RunServer(iPORT, iUUID) {
    G_GateWayTCP = tcp.CreateServer(iPORT,
        function () {
            console.log("GateWay TCP Init Success! Port:" + iPORT + " UUID:" + iUUID);
        },

        function (hSocket, sBuffer) {

        },

        function (hSocket) {

        },

        function (hSocket) {

        }
    );
};

///////////////////////////////////////////////
//大厅消息处理

//大厅连接成功
function HallConnectSuccess() {
    var iUUID = G_GateWay.UUID;
    var sPacket = {
        MM:"RegGateWay",
        UUID:iUUID
    };
    tcp.SendBuffer(G_HallSocket, JSON.stringify(sPacket));
};

//大厅消息路由, 大厅消息发送给客户端.
function HallMessageRoute(sBuffer) {
    var oPacket = JSON.parse(sBuffer);

    var iUUID = oPacket.UUID;

    if (!(iUUID in G_PoolClientSocket)){
        console.log("网关获取了 错误的玩家UUID:" + iUUID + " G_GateWay.UUID:" + G_GateWay.UUID);
        return;
    }
    var hSocket = G_PoolClientSocket[iUUID];

    ws.SendBuffer(hSocket, JSON.stringify(oPacket));
};