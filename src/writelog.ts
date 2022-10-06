/**
 * this module provide log write functions.
 */

import {Socket} from "net";

import {
    ok,
    code_length_illegal,
    code_illegal,
    dialogpath,
    okdiag,
    diag,
    codeIllegalDiag,
    codeLengthIllegalDiag, encoding, ipv6, ipv6diag
} from "./constants";
import {openSync, writeFileSync} from "fs";

// 支持数据库热重载，每整点刷新一次
export let ipip = require('ipip-ipdb')
export let cities = new ipip.City('../ipipfree.ipdb')

export
function getcity(sok:Socket) {
    if (sok.address().family === 'IPv4') {
        const info = cities.findInfo(sok.address().address, 'CN')
        return `${info.countryName}, ${info.regionName}, ${info.cityName}`
    } else {
        return '未知地址'
    }
}

export
function genlog(data, sok:Socket, symdiag:diag) {
    const time = new Date(Date.now())
    return Buffer.from(`${time.getFullYear()}年${time.getMonth() + 1}月${time.getDate()}日 ${time.toLocaleTimeString()}\n${symdiag.tp} ${symdiag.sym.description}\n内容：${data.toString()}\n${sok.address().address} from ${getcity(sok)}\n\n`)
}

export
function writelog(data: Buffer, sok:Socket,sym: Symbol) {
    const stream = openSync(dialogpath, 'a')
    switch (sym) {
        case ok:
            writeFileSync(stream, genlog(data, sok, okdiag), {
                encoding: encoding
            })
            break
        case code_illegal:
            writeFileSync(stream, genlog(data, sok, codeIllegalDiag), {
                encoding: encoding
            })
            break
        case code_length_illegal:
            writeFileSync(stream, genlog(data, sok, codeLengthIllegalDiag), {
                encoding: encoding
            })
            break
        case ipv6:
            writeFileSync(stream, genlog(data, sok, ipv6diag), {
                encoding: encoding
            })
    }
}