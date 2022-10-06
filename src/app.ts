/**
 * 方向对了，才能更快解决问题
 */


import {Player} from "./player";
import {Socket} from "net";
import {encoding, invincible_time} from "./constants";
import * as Buffer from "buffer";

export
const app = new
class App {
    host: Player = null;                                // 房主
    playerpool: Array<Player> = [];                     // 玩家池
    private toJSON(data: Buffer) {                      // 解决玩家过于频繁的发送json消息，决定采取换行符分割的手段
        const msgs = data.toString(encoding).split('\n')
        const r = []
        msgs.forEach(value => {
            if (value.length) {
                r.push(JSON.parse(value))
            }
        })
        return r
    }
    /**
     * 广播data对象代表的信息
     * @param data      发送的数据
     * @param sender    发送者，数据不会发送给发送者
     */
    broadcast(data: object | string, sender?:Player) {
        console.log('broadcast', typeof data === "string" ? data : JSON.stringify(data))
        this.playerpool.forEach(player => {
            try {
                if (player !== sender) {
                    player.socket.write(typeof data === "string" ? data : JSON.stringify(data), encoding)
                }
            } catch (e) {
                console.log(e)
            }
        })
    }

    /**
     * @description 向所有玩家告知某玩家脱离无敌状态
     * @param player
     */
    player_vincible(player: Player){
        this.broadcast(JSON.stringify({
            type: 'player_vincible',
            value: {
                id: player.data.id
            }
        }) + '\n')
    }
    /**
     * 准入一个socket，初始化玩家信息，并返回玩家恰当的消息：
     *      1.若玩家为首位加入的玩家，则返回 {
     *          type: 'connect'
     *          value: {
     *              id: ...
     *              host: true
     *          }
     *      }
     *      2.若玩家不是首位加入的玩家，则先返回 {
     *          type: 'connect'
     *          value: {
     *              id: ...
     *              host: false
     *          }
     *      }，然后返回 {
     *          type: 'global'
     *          value: ...
     *      } 的消息
     * @param socket 准入socket
     * @param code 新 socket 的飞机代码
     */
    add(socket: Socket, code: number): void {   // finish
        console.dir(this.playerpool)
        try {
            const player = new Player(socket, code)
            socket.write(JSON.stringify({
                type: 'connect',
                value: {
                    id: player.data.id,
                    host: !this.host
                }
            }), encoding)
            if (this.host) {
                this.host.socket.write(JSON.stringify({
                    type: 'require_global'
                }), encoding)
                let rsv = (data) => {
                    const msg = this.toJSON(data)
                    if (msg[0].type == 'global') {
                        socket.write(data)
                        socket.removeListener('data', rsv)
                        let getready = (data) => {
                            const msg = this.toJSON(data)
                            if (msg[0].type == 'ready') {
                                /**
                                 * 玩家接受到global信息准备好接受进入了
                                 */
                                console.log(player.data.id, 'join')
                                this.broadcast({     // 广播消息
                                    type: 'player_join',
                                    value: {
                                        code: player.data.code,
                                        id: player.data.id,
                                    }
                                })
                                setTimeout(() => {
                                    this.player_vincible(player)
                                }, invincible_time)   // 三秒之后告知所有玩家该玩家退出无敌状态
                                this.playerpool.push(player)
                                player.socket.on('close', () => {
                                    this.leave(player)
                                })
                                player.socket.on('data', (data) => {
                                    this.broadcast(data.toString())
                                })
                                socket.removeListener('data', getready)
                            }
                        }
                        socket.on('data', getready)
                    }
                }
                this.host.socket.on('data', rsv)            // 从房主那里获取全局信息，发送给新玩家
            } else {
                let ready = (data) => {
                    const msg = this.toJSON(data)
                    if (msg[0].type == 'ready') {
                        /**
                         * 玩家准备好成为房主了
                         */
                        console.log(player.data.id, 'join')
                        this.host = player
                        setTimeout(() => {
                            this.player_vincible(player)
                        }, invincible_time)
                        this.playerpool.push(player)
                        socket.removeListener('data', ready)
                        player.socket.on('close', () => {
                            this.leave(player)
                        })
                        player.socket.on('data', (data) => {
                            this.broadcast(data.toString())
                        })
                    }
                }
                socket.on('data', ready)
            }
            socket.on('error', () => {
                console.log('socket error, closed')
                socket.end()
            })
        } catch (e) {
            console.log(e)
        }
    }

    /**
     * 告别一个玩家，广播消息
     * @param leaveplayer 离开的玩家对象
     */
    leave(leaveplayer: Player) {
        // 在一个 player 离开的时候，调用此函数
        console.log(leaveplayer.data.id, "leave")
        this.playerpool.splice(this.playerpool.findIndex(value => value === leaveplayer), 1)
        this.playerpool.forEach(player => {
            player.socket.write(JSON.stringify({
                type: 'player_leave',
                value: {
                    id: player.data.id
                }
            }), encoding)
        })
        if (leaveplayer == this.host) {
            this.realloc_host()
        }
        this.broadcast({
            type: 'player_leave',
            value: {
                id: leaveplayer.data.id
            }
        })
    }

    /**
     * @description 分配房主
     */
    realloc_host() {
        if (this.playerpool.length > 0) {
            this.host = this.playerpool[0]          // 最先加入的玩家优先成为新host
            this.playerpool[0].socket.write(JSON.stringify({
                type: 'host'
            }))
        } else {
            this.host = null        // 没有房主
        }
    }
}

