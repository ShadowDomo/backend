"use strict";
/* Entry point into server. */
exports.__esModule = true;
require('dotenv').config();
var cors = require('cors');
require('newrelic');
var helmet = require("helmet");
var express = require("express");
var routes_1 = require("./routes");
var socketHandler_1 = require("./socketHandler");
var PORT = process.env.PORT || 3001;
var app = express();
// SOCKETS
var httpServer = require('http').createServer(app);
var io = require('socket.io')(httpServer, {
    cors: {
        origin: [
            'http://syndeyforum-env.eba-f4xyppqy.ap-southeast-2.elasticbeanstalk.com/',
            'http://localhost:3000',
            'http://domz.me',
        ],
        methods: ['GET', 'POST']
    }
});
// handles sockets
io.on('connection', socketHandler_1["default"]);
// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use('/api', routes_1["default"]);
app.set('io', io);
// app.listen(PORT, () => {
//   console.log(`listening on port ${PORT}`);
// });
httpServer.listen(PORT, function () {
    console.log('sockets and server are listening on ' + PORT);
});
