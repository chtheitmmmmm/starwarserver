"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var writelog_1 = require("./writelog");
var net = require('net');
var rsvdt_1 = require("./rsvdt");
var constants_1 = require("./constants");
var app_1 = require("./app");
var server = net.createServer(function (socket) {
    if (socket.address().family === 'IPv6') {
        (0, writelog_1.writelog)(Buffer.from(""), socket, constants_1.ipv6);
        socket.end();
        return;
    }
    socket.once('data', function (code) {
        var sym = (0, rsvdt_1.rsvdt_first)(code);
        if (sym !== constants_1.ok) {
            socket.end();
        }
        else {
            app_1.app.add(socket, code);
        }
        (0, writelog_1.writelog)(code, socket, sym);
    });
});
server.listen(constants_1.port);
