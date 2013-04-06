var tcp = require("../LighterWebEngine/TCP");
var cfg = require("../Common/Config");

//tcp.CreateServer(cfg.GateWayServerMainPort, function(hSocket, sBuffer) {
//    console.log(sBuffer);
//
//    tcp.SendBuffer(hSocket, "哈哈哈");
//});


var hSocket = tcp.CreateClient(cfg.AdaptServerPort, "", function(){}, function(sBuffer){
    var oPacket = JSON.parse(sBuffer);
    switch(oPacket.MM){
        case "GetUUID":
            console.log(oPacket.UUID);
            break;
    };
});

var sPacket = {};
sPacket["MM"] = "GetUUID";
tcp.SendBuffer(hSocket, JSON.stringify(sPacket));

