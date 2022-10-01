/**
 * 方向对了，才能更快解决问题
 */


import {Player, players} from "./player";
import {Socket} from "net";
import {encoding} from "./constants";

export
const app = new
class App {
    host: Player;                                       // 房主
    playerpool: typeof players = players;               // 玩家池
    /**
     * 准入一个socket
     * @param socket 准入socket
     * @param data  准入socket传入的第一个数据
     */
    add(socket: Socket, data: Buffer): void {   // finish
        this.host.getData(global => {
            const player = this.playerpool.add(socket, JSON.stringify(global), data)
            if (player !== undefined) {
                // 玩家成功加入
                player.socket.on('close', () => {
                    this.leave(player)
                })
                player.socket.on('data', (data) => {
                    this.broadcast(data, player)
                })
            } else {
                socket.end() // 房间已无空位，关闭套接字
            }
        })

    }

    /**
     * 告别一个玩家
     * @param player
     */
    leave(player: Player) {
        // 在一个 player 离开的时候，调用此函数
        this.playerpool.splice(this.playerpool.findIndex(value => value === player), 1)
        if (player == this.host) {
            this.realloc_host()
        }
        this.broadcast({
            type: 'leave',
        })
    }
    realloc_host() {
        if (this.playerpool.length > 0) {
            this.playerpool[0].socket.write(JSON.stringify({
                type: 'host'
            }))
        }
    }


    /**
     * 广播data对象代表的信息
     * @param data      发送的数据
     * @param sender    发送者，数据不会发送给发送者
     */
    broadcast(data: object | string, sender?:Player) {
        this.playerpool.forEach(player => {
            if (player !== sender) {
                player.socket.write(typeof data === "string" ? data : JSON.stringify(data), encoding)
            }
        })
    }
}

