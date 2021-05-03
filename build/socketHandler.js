"use strict";
exports.__esModule = true;
exports.connections = void 0;
// holds threadIDs and sockets which are connected
exports.connections = {};
/** The handler for all socket connections. */
var onConnection = function (socket) {
    // client sends the current threadID
    var clientID = socket.id;
    var threadID;
    socket.on('onThread', function (response) {
        threadID = onThread(response, clientID);
        socket.join(threadID);
        console.log(socket.rooms);
    });
    // send socket ID
    socket.emit('your id', clientID);
    socket.on('disconnect', function () { return disconnect(threadID, clientID); });
    // function emitMessageToClient() {
    //   socket.emit('update', 'someone made an update to this thread');
    // }
};
function disconnect(threadID, clientID) {
    console.log('DISCONNECTED');
    if (!Object.prototype.hasOwnProperty.call(exports.connections, threadID)) {
        return;
    }
    if (!exports.connections[threadID].has(clientID)) {
        return;
    }
    exports.connections[threadID]["delete"](clientID);
    console.log(exports.connections);
}
function onThread(response, clientID) {
    var threadID = response;
    console.log('received data from client response was: ' + threadID);
    if (!Object.prototype.hasOwnProperty.call(exports.connections, threadID)) {
        exports.connections[threadID] = new Set();
    }
    exports.connections[threadID].add(clientID);
    console.log(exports.connections);
    return threadID;
}
exports["default"] = onConnection;
