import {readFileSync} from "fs";

export const port = 9800;  // 服务器工作端口
export const max_player_num = 5
export const encoding : 'utf-8' = 'utf-8'

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

