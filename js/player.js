"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.players = exports.Player = void 0;
var constants_1 = require("./constants");
var Player = (function () {
    function Player(socket, code) {
        this.socket = socket;
        this.data.code = code;
    }
    return Player;
}());
exports.Player = Player;
exports.players = new (function (_super) {
    __extends(PlayerPool, _super);
    function PlayerPool() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PlayerPool.prototype.add = function (socket, appdata, code) {
        if (this.length < constants_1.max_player_num) {
            var player = new Player(socket, code.readInt32LE());
            socket.write(player.data.id, constants_1.encoding);
            this.push(player);
            socket.write(appdata, constants_1.encoding);
            return player;
        }
        return undefined;
    };
    return PlayerPool;
}(Array));
