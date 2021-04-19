"use strict";
/* Entry point into server. */
exports.__esModule = true;
require('dotenv').config();
var cors = require('cors');
var helmet = require("helmet");
var express = require("express");
var routes_1 = require("./routes");
var PORT = process.env.PORT || 3001;
var app = express();
// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use('/api', routes_1["default"]);
app.listen(PORT, function () {
    console.log("listening on port " + PORT);
});
