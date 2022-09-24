import {Socket} from "net";
import {encoding, max_player_num} from "./constants";
import {v4} from "uuid"
import {Vector2} from "./vector2";
import {enemy} from "./enemy";

export
type player_move = {
    type: "move",
    value: Vector2<number>      // 新位置
}
export
type host_enemy_move = {        // 当前房主负责同步怪物
    type: "enemy_move",
    value: Array<{
        id: string,             // 敌人id
        pos: Vector2<number>    // 敌人位置
    }>
}
export
type host_enemy_destory = {
    type: "enemy_destory",
    value: Array<{
        id: string              // 死亡敌人的id名单
    }>
}

export
type player_instructor = player_move | host_enemy_move | host_enemy_destory

export
type player_data = {
    code: number;
    id: string;
    plane: {
        stat: number,           // 飞机外观状态码
        weapon: number,         // 飞机武器代码
        pos: Vector2<number>    // 这里的pos唯一的作用是发送给新加入的玩家，服务器端不处理
        hp: number
    }
}

export
class Player{
    /**
     * 客户端发送相关指令给服务器，服务器运算更新飞机的位置、外观状态等信息
     */
    socket: Socket;
    data: player_data;
    constructor(socket: Socket, code: number) {
        this.socket = socket;
        this.data.code = code;
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