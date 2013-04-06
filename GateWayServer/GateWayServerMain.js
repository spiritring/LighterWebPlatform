var tcp = require("../LighterWebEngine/TCP");

tcp.CreateServer(8124, function(hSocket, sBuffer) {
    console.log(sBuffer);
});

