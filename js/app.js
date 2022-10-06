"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const player_1 = require("./player");
const constants_1 = require("./constants");
exports.app = new class App {
    constructor() {
        this.host = null;
        this.playerpool = [];
    }
    toJSON(data) {
        const msgs = data.toString(constants_1.encoding).split('\n');
        const r = [];
        msgs.forEach(value => {
            if (value.length) {
                r.push(JSON.parse(value));
            }
        });
        return r;
    }
    broadcast(data, sender) {
        console.log('broadcast', typeof data === "string" ? data : JSON.stringify(data));
        this.playerpool.forEach(player => {
            try {
                if (player !== sender) {
                    player.socket.write(typeof data === "string" ? data : JSON.stringify(data), constants_1.encoding);
                }
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    player_vincible(player) {
        this.broadcast(JSON.stringify({
            type: 'player_vincible',
            value: {
                id: player.data.id
            }
        }) + '\n');
    }
    add(socket, code) {
        console.dir(this.playerpool);
        try {
            const player = new player_1.Player(socket, code);
            socket.write(JSON.stringify({
                type: 'connect',
                value: {
                    id: player.data.id,
                    host: !this.host
                }
            }), constants_1.encoding);
            if (this.host) {
                this.host.socket.write(JSON.stringify({
                    type: 'require_global'
                }), constants_1.encoding);
                let rsv = (data) => {
                    const msg = this.toJSON(data);
                    if (msg[0].type == 'global') {
                        socket.write(data);
                        socket.removeListener('data', rsv);
                        let getready = (data) => {
                            const msg = this.toJSON(data);
                            if (msg[0].type == 'ready') {
                                console.log(player.data.id, 'join');
                                this.broadcast({
                                    type: 'player_join',
                                    value: {
                                        code: player.data.code,
                                        id: player.data.id,
                                    }
                                });
                                setTimeout(() => {
                                    this.player_vincible(player);
                                }, constants_1.invincible_time);
                                this.playerpool.push(player);
                                player.socket.on('close', () => {
                                    this.leave(player);
                                });
                                player.socket.on('data', (data) => {
                                    this.broadcast(data.toString());
                                });
                                socket.removeListener('data', getready);
                            }
                        };
                        socket.on('data', getready);
                    }
                };
                this.host.socket.on('data', rsv);
            }
            else {
                let ready = (data) => {
                    const msg = this.toJSON(data);
                    if (msg[0].type == 'ready') {
                        console.log(player.data.id, 'join');
                        this.host = player;
                        setTimeout(() => {
                            this.player_vincible(player);
                        }, constants_1.invincible_time);
                        this.playerpool.push(player);
                        socket.removeListener('data', ready);
                        player.socket.on('close', () => {
                            this.leave(player);
                        });
                        player.socket.on('data', (data) => {
                            this.broadcast(data.toString());
                        });
                    }
                };
                socket.on('data', ready);
            }
            socket.on('error', () => {
                console.log('socket error, closed');
                socket.end();
            });
        }
        catch (e) {
            console.log(e);
        }
    }
    leave(leaveplayer) {
        console.log(leaveplayer.data.id, "leave");
        this.playerpool.splice(this.playerpool.findIndex(value => value === leaveplayer), 1);
        this.playerpool.forEach(player => {
            player.socket.write(JSON.stringify({
                type: 'player_leave',
                value: {
                    id: player.data.id
                }
            }), constants_1.encoding);
        });
        if (leaveplayer == this.host) {
            this.realloc_host();
        }
        this.broadcast({
            type: 'player_leave',
            value: {
                id: leaveplayer.data.id
            }
        });
    }
    realloc_host() {
        if (this.playerpool.length > 0) {
            this.host = this.playerpool[0];
            this.playerpool[0].socket.write(JSON.stringify({
                type: 'host'
            }));
        }
        else {
            this.host = null;
        }
    }
};
