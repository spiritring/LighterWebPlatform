var tcp = require("../LighterWebEngine/TCP");
var cfg = require("../Common/Config");

// 重启流程保护: 通知AS, AS通知GWS, 重新连接HS.
var G_ASSocket = tcp.CreateClient(cfg.AdaptServerPort, cfg.AdaptServerPort,
    function (){
        // 给AS发请求.然后AS发通知给网关.重新连接HS
        var sPacket = {
            MM:"HS_ConnectHall"
        };
        tcp.SendBuffer(G_ASSocket,JSON.stringify(sPacket));
    },

    function (sBuffer){

    }
);

// 启动大厅服务器
tcp.CreateServer(cfg.HallServerPort,
    function() {
        console.log("Timeshift HallTCPServer Success!");
    },

    function(hSocket, sBuffer) {
        var oPacket = JSON.parse(sBuffer);
        console.log(oPacket.MM + ":" +oPacket.Order + ":" + oPacket.UUID);
        switch (oPacket.MM) {
            case "SysOrder": //用户命令行
                ProcessOrder(oPacket.Order, parseInt(oPacket.UUID), hSocket);
                break;
        }
    },

    function(hSocket) {

    },

    function(hSocket) {

    }
);

function ProcessOrder(sBuffer, iUUID, hSocket) {
    var sOrder = sBuffer.split(":");
    switch(sOrder[0]) {
        case "Login":
        case "login":
            var name = sOrder[1];
            var password = 0;
            if(sOrder.length > 2)
                password = sOrder[2];

            hSocket.UUID = iUUID;

            //记录登陆玩家名字和UUID
            console.log(name + ":" + iUUID);

            break;
    }

}