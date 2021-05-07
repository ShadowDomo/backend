"use strict";
exports.__esModule = true;
exports.broadcast = void 0;
/** Generic socket handler. */
function broadcast(req, eventName, body, room) {
    var app = req.app;
    var io = app.get('io');
    io.to(room).emit(eventName, body);
}
exports.broadcast = broadcast;
