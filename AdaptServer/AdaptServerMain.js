// 主要职责.分配ID.路由登陆.负载平衡网关.
// 启动服务器时候.先启动该服务器.之后其他的服都会请求该分配服.分配端口号之类的操作.

var tcp = require("../LighterWebEngine/TCP");
var cfg = require("../Common/Config");
var uuid = require("./UUID");

tcp.CreateServer(cfg.AdaptServerPort, function(hSocket, sBuffer) {
    var oPacket = JSON.parse(sBuffer);
    switch (oPacket.MM) {
        case "GetUUID":
            GateWay_GetUUID(hSocket);
            break;
    };
});

function GateWay_GetUUID(hSocket){
    var sPacket = {};
    sPacket["MM"] = "GetUUID";
    sPacket["UUID"] = uuid.G_UUID();
    tcp.SendBuffer(hSocket, JSON.stringify(sPacket));
};





