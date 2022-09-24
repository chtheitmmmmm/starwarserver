"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var player_1 = require("./player");
var enemy_1 = require("./enemy");
var constants_1 = require("./constants");
exports.app = new (function () {
    function App() {
        this.playerpool = player_1.players;
        this.enemypool = enemy_1.enemys;
        this.state = 'pendding';
    }
    App.prototype.add = function (socket, data) {
        var _this = this;
        var player = this.playerpool.add(socket, this.genappdata(), data);
        if (player !== undefined) {
            player.socket.on('close', function () {
                _this.leave(player);
            });
            player.socket.on('data', function (data) {
                var instructor = JSON.parse(data.toString());
                switch (instructor.type) {
                    case "move":
                        break;
                    case "enemy_move":
                        break;
                    case "enemy_destory":
                        break;
                }
            });
            this.start();
        }
        else {
            socket.end();
        }
    };
    App.prototype.leave = function (player) {
        this.playerpool.splice(this.playerpool.findIndex(function (value) { return value === player; }), 1);
        if (this.playerpool.length <= 0) {
            this.state = "pendding";
            clearInterval(this.interval);
        }
        else {
            this.broadcast({
                type: 'leave',
                value: {
                    id: player.data.id
                }
            });
        }
    };
    App.prototype.start = function () {
        var _this = this;
        if (this.state !== 'running') {
            this.state = 'running';
            this.timestep = {
                value: 0,
                actions: [{
                        step: constants_1.FPS * 3,
                        action: this.add_enemy
                    }]
            };
            this.interval = setInterval(function () {
                _this.update();
            }, 1000 / constants_1.FPS);
        }
    };
    App.prototype.update = function () {
        var _this = this;
        ++this.timestep.value;
        this.timestep.actions.forEach(function (value) {
            if (_this.timestep.value % value.step === 0) {
                value.action();
            }
        });
    };
    App.prototype.broadcast = function (data, sender) {
        this.playerpool.forEach(function (player) {
            if (player !== sender) {
                player.socket.write(typeof data === "string" ? data : JSON.stringify(data), constants_1.encoding);
            }
        });
    };
    App.prototype.add_enemy = function () {
        var enemy = this.enemypool.add();
        this.broadcast({
            type: 'add_enemy',
            value: enemy
        });
    };
    App.prototype.genappdata = function () {
        var data = {
            type: "global",
            value: this.gengloabaljson()
        };
        for (var _i = 0, _a = this.playerpool; _i < _a.length; _i++) {
            var player = _a[_i];
            data.value.players.push(player.data);
        }
        return JSON.stringify(data);
    };
    App.prototype.gengloabaljson = function () {
        var data = {
            enemys: this.enemypool,
            players: []
        };
        for (var _i = 0, _a = this.playerpool; _i < _a.length; _i++) {
            var player = _a[_i];
            data.players.push(player.data);
        }
        return data;
    };
    return App;
}());
