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

    this.ClientOffLine = function(iUUID) {

        console.log("ClientOffLine:UUID=" + iUUID);
        if(iUUID == 0) {
            return;
        }

        var name = Pool_User.UUID[iUUID].Name;
        delete Pool_User.NAME[name];
        delete Pool_User.UUID[iUUID];

        console.log("玩家下线 名字:" + name + " UUID:" + iUUID + " 大厅人数:" + Object.keys(Pool_User.UUID).length);
    }

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
                if (name in Pool_User.NAME) {
                    console.log("该名称已存在.不能重复登录!");
                    return;
                }

                if (iUUID in Pool_User.UUID) {
                    console.log("该UUID已存在.不能重复登录!");
                    return;
                }

                this.Msg_Login(iUUID, name, password, hSocket);

                break;
        }
    }

    this.Msg_Login = function(iUUID, sName, sPassword, hSocket){
        Pool_User.UUID[iUUID] = new def.UserStruct(iUUID, sName, sPassword);
        Pool_User.NAME[sName] = Pool_User.UUID[iUUID];

        console.log("大厅的玩家数量:" + Object.keys(Pool_User.UUID).length);

        //通知玩家登陆成功.
        var sPacket = {
            MM : "LoginSuccess",
            UUID : iUUID,
            NAME : sName
        };
        tcp.SendBuffer(hSocket, JSON.stringify(sPacket));
    }

};

module.exports = {
    HallSystem:HallSystem
};