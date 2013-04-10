var tcp = require("../LighterWebEngine/TCP");
var cfg = require("../Common/Config");

var G_GameServer = {
    UUID:0
};

var G_HallSocket = tcp.CreateClient(cfg.HallServerPort, cfg.HallServerIP,
    function () {
        console.log("游戏服连接大厅服成功!");
    },

    function (sBuffer) {
        var oPacket = JSON.parse(sBuffer);
        switch(oPacket.MM) {
            case "RegGameServer":
                G_GameServer.UUID = oPacket.UUID;
                break;
            case "EnterGame":
                Msg_EnterGame(oPacket);
                break;
        }
    }
);

var sPacket = {
    MM: "RegGameServer"
};
tcp.SendBuffer(G_HallSocket, JSON.stringify(sPacket));

//////////////////////////////////////////////////////////////////////////
// 游戏房间管理
var Pool_Room = {};
var Pool_UUID_ROOM = {};
// 网关连接管理
var Pool_GW = {};
// 消息处理
function Msg_EnterGame(oPacket) {
    Pool_Room[oPacket.Room.RoomID] = oPacket.Room;

    for (var iUUID in oPacket.Room.ClientArr) {
        Pool_UUID_ROOM[iUUID] = oPacket.Room.RoomID;
    }

    for (var i in oPacket.WS) {
        var iter = oPacket.WS[i];

        //判断是否连接了重复的网关
        if (iter.UUID in Pool_GW) {
            //通知网关.更改该UUID的玩家.与Hall断开路由.转而与本游戏服路由.
            var sPacket = {};
            sPacket.MM = "RouteToGameServer";
            sPacket.Room = oPacket.Room;
            tcp.SendBuffer(Pool_GW[iter.UUID], JSON.stringify(sPacket));
            continue;
        }

        var hSocket = tcp.CreateClient(iter.Port, iter.IP,
            function () {
                console.log("连接网关 Port:" + iter.Port + " IP:" + iter.IP + " UUID:" + iter.UUID);
                Pool_GW[iter.UUID] = hSocket;

                //通知网关.更改该UUID的玩家.与Hall断开路由.转而与本游戏服路由.
                var sPacket = {};
                sPacket.MM = "RouteToGameServer";
                sPacket.Room = oPacket.Room;
                tcp.SendBuffer(hSocket, JSON.stringify(sPacket));
            },
            ClientMsgProcess
        );
    }
};

function PlayerUUIDGetGateWayUUID(iUUID){
    var iGWUUID = iUUID % cfg.GateWayServerPlayerIDRule;
    return iGWUUID;
};

function GS_SendBuffer(iUUID, sBuffer) {
    tcp.SendBuffer(Pool_GW[PlayerUUIDGetGateWayUUID(iUUID)], sBuffer);
};

function ClientMsgProcess(sBuffer) {
    var oPacket = JSON.parse(sBuffer);
    switch(oPacket.MM) {
        case "LeaveGame":
            var sPacket = {
                MM : "LeaveGame",
                UUID : oPacket.UUID
            };
            GS_SendBuffer(oPacket.UUID, JSON.stringify(sPacket));
            break;
    }
};

