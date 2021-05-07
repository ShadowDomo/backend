"use strict";
exports.__esModule = true;
// holds threadIDs and sockets which are connected
// export const connections: Object = {}; // TODO dont need this
/** The handler for all socket connections. */
var onConnection = function (socket) {
    // client sends the current threadID
    // for each thread
    var clientID = socket.id;
    socket.on('onThread', function (threadID) {
        socket.join(threadID);
    });
    // for community home pages
    socket.on('onCommunity', function (communityName) {
        socket.join(communityName);
    });
    // send socket ID
    socket.emit('your id', clientID);
};
exports["default"] = onConnection;
