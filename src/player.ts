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
}