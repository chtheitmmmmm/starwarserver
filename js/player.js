"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const uuid_1 = require("uuid");
class Player {
    constructor(socket, code) {
        this.data = {
            code: 0,
            id: (0, uuid_1.v4)()
        };
        this.socket = socket;
        this.data.code = code;
    }
}
exports.Player = Player;
