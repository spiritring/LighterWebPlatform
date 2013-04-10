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
        }
    }
);

var sPacket = {
    MM: "RegGameServer"
};
tcp.SendBuffer(G_HallSocket, JSON.stringify(sPacket));









