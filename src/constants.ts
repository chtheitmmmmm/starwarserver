import {readFileSync} from "fs";
import {Vector2} from "./vector2";

export const port = 9800;  // 服务器工作端口



export const v1len = 36    // v1随机id长度
export const data_length = 53 // 玩家发送实时数据的长度
export const room_pool_len = 20 // 最多支持20个房间
export const max_player_num = 5
export const encoding : 'utf-8' = 'utf-8'
export const enemyGenInterval = {
    easy: 3000,
    medium: 2000,
    difficult: 1000
} // 敌人生成时间间隔，难度等级随着人数增加
export const window_size: Vector2<number> = {
    x: 640,
    y: 797
}
export const FPS: 60 = 60
export const plane_size: Vector2<number> = {
    x: 128,
    y: 128
}

export const player_hp: number = 100;

const typecodepath = "../typecode.json"
export const dialogpath = '../logs.txt'
type typecodetype = {
    'types': Array<{
        "name": string,
        'codes': Array<{
            'name': string,
            'code': number
        }>
    }>
}

export const typecode: typecodetype = JSON.parse(readFileSync(typecodepath).toString('utf-8'))

export const ok = Symbol('正常')
export const code_illegal = Symbol('不合法的类型代码')
export const code_length_illegal = Symbol("代码长度不合法")
export const ipv6 = Symbol("来自IPV6!")

export type diag = {
    tp: 'success' | 'error',
    sym: symbol
}

export const okdiag : diag = {
    tp: 'success',
    sym: ok
}

export const ipv6diag: diag = {
    tp: "error",
    sym: ipv6
}

export const codeIllegalDiag: diag = {
    tp: 'error',
    sym: code_illegal
}

export const codeLengthIllegalDiag: diag = {
    tp: "error",
    sym: code_length_illegal
}

