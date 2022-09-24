import {Player, player_data, player_instructor, players} from "./player";
import {enemy, enemys} from "./enemy";
import {Vector2} from "./vector2";
import {Socket} from "net";
import {encoding, FPS} from "./constants";

export
type global_data = {
    enemys: Array<{
        id: string,
        code: number,
        pos: Vector2<number>,
        hp: number,
        weapon_code: number
    }>,
    players: Array<player_data> // todo: 注意这里的player_data虽然保存了pos，但是pos还是需要向其他玩家请求
}
export
type global_appdata = {
    type: 'global',
    value: global_data
}

export
type control_data = {
    id: string,
    control: player_instructor
}   // control data
export
type control_appdata = {
    type: 'control',
    value: control_data
}

export
type leave_data = {
    id: string
}
export
type leave_appdata = {
    type: 'leave',
    value: leave_data
}

export
type add_enemy_appdata = {
    type: 'add_enemy',
    value: enemy
}

export
type appdata = global_appdata | control_appdata | leave_appdata | add_enemy_appdata

export
const app = new
class App {
    playerpool: typeof players = players;               // 玩家池
    enemypool: typeof enemys = enemys;                  // 怪物池
    state: 'running' | 'pendding' = 'pendding';         // 状态机
    timestep: {                                         // 动作池
        value: number;
        actions: Array<{
            step: number,
            action: Function
        }>
    };
    interval: NodeJS.Timer                              // 计时器
    /**
     * 准入一个socket
     * @param socket 准入socket
     * @param data  准入socket传入的第一个数据
     */
    add(socket: Socket, data: Buffer): void {   // finish
        const player = this.playerpool.add(socket, this.genappdata(), data)
        if (player !== undefined) {
            // 玩家成功加入
            player.socket.on('close', () => {
                this.leave(player)
            })
            player.socket.on('data', (data) => {
                const instructor: player_instructor = JSON.parse(data.toString());
                switch (instructor.type) {
                    case "move":
                        break;
                    case "enemy_move":
                        break;
                    case "enemy_destory":
                        break;

                }
            })
            this.start();   // 启动
        } else {
            socket.end() // 房间已无空位，关闭套接字
        }
    }

    /**
     * 告别一个玩家
     * @param player
     */
    leave(player: Player) {
        // 在一个 player 离开的时候，调用此函数
        this.playerpool.splice(this.playerpool.findIndex(value => value === player), 1)
        if (this.playerpool.length <= 0) {
            // 进入睡眠状态
            this.state = "pendding"
            clearInterval(this.interval)
        } else {
            this.broadcast({
                type: 'leave',
                value: {
                    id: player.data.id
                }
            })
        }
    }

    /**
     * 启动app
     */
    start() {
        // 每当有新玩家加入，尝试重新启动app
        if (this.state !== 'running') {
            this.state = 'running'
            this.timestep = {
                value: 0,
                actions: [{
                    step: FPS * 3,
                    action: this.add_enemy
                }]
            };
            this.interval = setInterval(() => {
                this.update()
            }, 1000 / FPS)
        }
    }

    /**
     * 更新timestep，并在可能的时候执行
     */
    update() {
        ++this.timestep.value;
        this.timestep.actions.forEach(value => {
            if (this.timestep.value % value.step === 0) {
                value.action()
            }
        })
    }

    /**
     * 广播data对象代表的信息
     * @param data      发送的数据
     * @param sender    发送者，数据不会发送给发送者
     */
    broadcast(data: appdata | string, sender?:Player) {
        this.playerpool.forEach(player => {
            if (player !== sender) {
                player.socket.write(typeof data === "string" ? data : JSON.stringify(data), encoding)
            }
        })
    }

    /**
     * 每
     * @private
     */
    private add_enemy() {
        const enemy = this.enemypool.add();
        this.broadcast({
            type: 'add_enemy',
            value: enemy
        })
    }

    /**
     * 根据当前app状态生成global类型的信息
     */
    private genappdata(): string {
        const data: global_appdata = {
            type: "global",
            value: this.gengloabaljson()
        }
        for (const player of this.playerpool) {
            data.value.players.push(player.data)
        }
        return JSON.stringify(data)
    }

    private gengloabaljson(): global_data {
        const data: global_data = {
            enemys: this.enemypool,
            players: []
        }
        for (const player of this.playerpool) {
            data.players.push(player.data)
        }
        return data
    }
}

