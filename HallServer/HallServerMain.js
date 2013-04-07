var tcp = require("../LighterWebEngine/TCP");
var cfg = require("../Common/Config");

tcp.CreateServer(cfg.HallServerPort,
    function() {
        console.log("Timeshift HallTCPServer Success!");
    },

    function(hSocket, sBuffer) {
        var oPacket = JSON.parse(sBuffer);
        console.log(oPacket.MM + ":" +oPacket.UUID);
    },

    function(hSocket) {

    },

    function(hSocket) {

    }
);