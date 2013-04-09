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
var G_RoomIDAdapt = 0;

var Pool_UUID_ROOM = {};

var Pool_Room = {};
function CRoom(){
    this.ClientArr = {};
    this.RoomID = 0;
    this.LeaderID = 0;
    this.LeaderName = "";
};

var Pool_GateWaySocket = {};

function HallSystem(){

    this.RegGateWay = function(iUUID, hSocket) {
        Pool_GateWaySocket[iUUID] = hSocket;
    };

    this.SendBuffer = function(iUUID, sPacket) {
        var iGWUUID = iUUID % 1000;
        tcp.SendBuffer(Pool_GateWaySocket[iGWUUID], JSON.stringify(sPacket));
    }

    this.ClientOffLine = function(iUUID) {

        console.log("ClientOffLine:UUID=" + iUUID);
        if(iUUID == 0) {
            return;
        }

        this.Msg_RemoveRoom(iUUID);

        if(iUUID in Pool_User.UUID){
            var name = Pool_User.UUID[iUUID].Name;
            delete Pool_User.NAME[name];
            delete Pool_User.UUID[iUUID];

            console.log("玩家下线 名字:" + name + " UUID:" + iUUID + " 大厅人数:" + Object.keys(Pool_User.UUID).length);
        }
    };

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
                return;
        }


        if (!(iUUID in Pool_User.UUID)){
            return;
        }

        switch(sOrder[0]) {
            case "CreateRoom":
                this.Msg_CreateRoom(iUUID, hSocket);
                break;
            case "GetRoomList":
                this.Msg_GetRoomList(iUUID, hSocket);
                break;
            case "RemoveRoom":
                this.Msg_RemoveRoom(iUUID);
                break;
            case "JoinRoom":
                var iRoomID = parseInt(sOrder[1]);
                this.Msg_JoinRoom(iUUID, iRoomID);
                break;
            case "LeaveRoom":
                this.Msg_LeaveRoom(iUUID);
                break;
        }
    };

    this.Msg_LeaveRoom = function (iUUID) {
        if(!(iUUID in Pool_UUID_ROOM)) {
            return;
        }
        var roomID = Pool_UUID_ROOM[iUUID];

        if(!(roomID in Pool_Room))
        {
            return;
        }

        var room = Pool_Room[roomID];

        delete room.ClientArr[iUUID];

        for (var i in room.ClientArr) {
            var sPacket = {};
            sPacket.UUID = i;
            sPacket.MM = "LeaveRoom";
            sPacket.Data = room;
            this.SendBuffer(sPacket.UUID, sPacket);
        }
    };

    this.Msg_JoinRoom = function(iUUID, iRoomID) {

        if (iRoomID in Pool_Room) {
            var room = Pool_Room[iRoomID];
            room.ClientArr[iUUID] = Pool_User.UUID[iUUID].Name;

            Pool_UUID_ROOM[iUUID] = room.RoomID;

            for (var i in room.ClientArr) {
                var sPacket = {};
                sPacket.UUID = i;
                sPacket.MM = "JoinRoom";
                sPacket.Data = room;
                this.SendBuffer(sPacket.UUID, sPacket);
            }
        }
    };

    this.Msg_RemoveRoom = function(iUUID){
        for (var i in Pool_Room) {
            var room = Pool_Room[i];
            if (room.LeaderID == iUUID){

                for (var j in room.ClientArr) {
                    var sPacket = {};
                    sPacket.UUID = j;
                    sPacket.MM = "RemoveRoom";
                    this.SendBuffer(sPacket.UUID, sPacket);
                }

                delete Pool_Room[i];
                break;
            }
        }
    };

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
    };

    this.Msg_CreateRoom = function(iUUID, hSocket){
        var room = new CRoom();
        room.RoomID = ++G_RoomIDAdapt;
        room.ClientArr[iUUID] = Pool_User.UUID[iUUID].Name;
        room.LeaderID = iUUID;
        room.LeaderName = Pool_User.UUID[iUUID].Name;
        Pool_Room[room.RoomID] = room;

        Pool_UUID_ROOM[iUUID] = room.RoomID;

        var sName = Pool_User.UUID[iUUID].Name;
        var sPacket = {
            MM: "CreateRoom",
            UUID: iUUID,
            NAME: sName,
            OK: true
        };
        tcp.SendBuffer(hSocket, JSON.stringify(sPacket));
    };

    this.Msg_GetRoomList = function(iUUID, hSocket){
        var sPacket = {};
        sPacket.UUID = iUUID;
        sPacket.MM = "GetRoomList";
        sPacket.Data = Pool_Room;
        tcp.SendBuffer(hSocket, JSON.stringify(sPacket));
    };

};

module.exports = {
    HallSystem:HallSystem
};