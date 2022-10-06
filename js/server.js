"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const writelog_1 = require("./writelog");
const net = require('net');
const rsvdt_1 = require("./rsvdt");
const constants_1 = require("./constants");
const app_1 = require("./app");
const server = net.createServer(socket => {
    if (socket.address().family === 'IPv6') {
        (0, writelog_1.writelog)(Buffer.from(""), socket, constants_1.ipv6);
    }
    socket.once('data', code => {
        const sym = (0, rsvdt_1.rsvdt_first)(code);
        if (sym !== constants_1.ok) {
            socket.end();
        }
        else {
            app_1.app.add(socket, code.readInt8());
        }
        (0, writelog_1.writelog)(code, socket, sym);
    });
});
server.listen(constants_1.port);
