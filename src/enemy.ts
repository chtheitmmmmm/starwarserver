/**
 * 此文件定义敌人类
 */
import {Vector2} from "./vector2";
import {plane_size, typecode, window_size} from "./constants";
import {randomInt} from "crypto";
import {v4} from "uuid";

export
declare interface enemy {
    // 服务器将所有敌人的生命值信息、代号信息、位置信息发送给所有在线客户端
    // 每一个玩家加入游戏之后
    hp : number;
    readonly code : number;
    readonly weapon_code: number;
    pos: Vector2<number>;               // todo: 这里的pos由房主负责更新，再由服务器分发
    id: string;
}

export
class Sa_1 implements enemy{
    hp = 100;
    pos;
    id: string = v4();
    readonly code = 1;
    readonly weapon_code = typecode.types.find(item => {
        return item.name === 'weapon'
    }).codes.find(item => {
        return item.name === 'red triangle'
    }).code
    constructor(pos) {                                  // todo: 当房主生成一个怪物时调用。
        this.pos = pos
    }
}

export
const enemytypes = [Sa_1]

export
const enemys = new
class enemyPool extends Array<enemy> {
    /**
     * 管理怪物的添加，删除
     */
    add(): enemy{
        const planetype = enemytypes[randomInt(0, enemytypes.length)]   // 随机怪物种类
        const plane = new planetype({   // 随机怪物位置
            x: randomInt(0, window_size.x - plane_size.x),
            y: randomInt(0, window_size.y - plane_size.y)
        })
        this.push(plane);
        return plane
    }
    destory() {
    }
}