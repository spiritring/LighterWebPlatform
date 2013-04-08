/**
 * Created with JetBrains WebStorm.
 * User: Enel
 * Date: 13-4-8
 * Time: 下午1:03
 * To change this template use File | Settings | File Templates.
 */
var tcp = require("../LighterWebEngine/TCP");
var cfg = require("../Common/Config");
var def = require("./StructDefine");

var Pool_User = {UUID:{}, NAME:{}};

function HallSystem(){
    this.ProcessOrder = function (sBuffer, iUUID, hSocket) {
        var sOrder = sBuffer.split(":");
        switch(sOrder[0]) {
            case "Login":
            case "login":
                var name = sOrder[1];
                var password = 0;
                if(sOrder.length > 2)
                    password = sOrder[2];

                //记录登陆玩家名字和UUID
                Pool_User.UUID[iUUID] = new def.UserStruct(iUUID, name, password);
                Pool_User.NAME[name] = Pool_User.UUID[iUUID];

                console.log("大厅的玩家数量:" + Object.keys(Pool_User.UUID).length);

                //通知玩家登陆成功.
                var sPacket = {
                    MM : "LoginSuccess",
                    UUID : iUUID
                };
                tcp.SendBuffer(hSocket, JSON.stringify(sPacket));

                break;
        }
    }

};

module.exports = {
    HallSystem:HallSystem
};