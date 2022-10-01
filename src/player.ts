import {Socket} from "net";
import {encoding, max_player_num} from "./constants";
import {v4} from "uuid"

export
type player_data = {
    code: number,
    id: string;
}

export
class Player{
    /**
     * 客户端发送相关指令给服务器，服务器运算更新飞机的位置、外观状态等信息
     */
    socket: Socket;
    data: player_data = {
        code: 0,
        id: v4()
    };
    constructor(socket: Socket, code: number) {
        this.socket = socket;
        this.data.code = code;
    }
    getData(callback: (data: Buffer) => void) {
        this.socket.write(JSON.stringify({
            type: 'global'
        }))
        this.socket.on('data', (data) => {
            data = JSON.parse(data.toString())
            if (data['type'] === 'global') {
                callback(data)
            }
        })
    }
}

export
const players = new
class PlayerPool extends Array<Player> {
    add(socket: Socket, appdata: string, code: Buffer) : Player | undefined{
        if (this.length < max_player_num) {
            const player = new Player(socket, code.readInt32LE())
            socket.write(player.data.id, encoding)
            this.push(player)
            // 写入当前app的数据
            socket.write(appdata, encoding)
            return player
        }
        return undefined
    }
}