var Pool_GateWayUUIDSocket = [];
var Pool_GateWaySocketUUID = [];
var Adapt_UUID = 0;
var Adapt_PORT = 0;

function G_UUID(){
    return ++Adapt_UUID;
};

function G_PORT(){
    return ++Adapt_PORT;
};

function G_GetSocket(UUID) {
    return Pool_GateWayUUIDSocket[UUID];
};

function G_GetUUID(Socket) {
    return Pool_GateWaySocketUUID[Socket];
};

function G_SetSU(Socket, UUID) {
    Pool_GateWayUUIDSocket[UUID] = Socket;
    Pool_GateWaySocketUUID[Socket] = UUID;
};

function G_RemoveS(Socket) {
    var UUID = Pool_GateWaySocketUUID[Socket];
    delete Pool_GateWaySocketUUID[Socket];
    delete Pool_GateWayUUIDSocket[UUID];
};

function G_RemoveU(UUID) {
    var Socket = Pool_GateWayUUIDSocket[UUID];
    delete Pool_GateWaySocketUUID[Socket];
    delete Pool_GateWayUUIDSocket[UUID];
}

module.exports = {
    G_UUID: G_UUID,
    G_PORT: G_PORT,
    G_GetSocket: G_GetSocket,
    G_GetUUID: G_GetUUID,
    G_SetSU: G_SetSU,
    G_RemoveS: G_RemoveS,
    G_RemoveU:G_RemoveU
}