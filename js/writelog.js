"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writelog = exports.genlog = exports.getcity = exports.cities = exports.ipip = void 0;
const constants_1 = require("./constants");
const fs_1 = require("fs");
exports.ipip = require('ipip-ipdb');
exports.cities = new exports.ipip.City('../ipipfree.ipdb');
function getcity(sok) {
    if (sok.address().family === 'IPv4') {
        const info = exports.cities.findInfo(sok.address().address, 'CN');
        return `${info.countryName}, ${info.regionName}, ${info.cityName}`;
    }
    else {
        return '未知地址';
    }
}
exports.getcity = getcity;
function genlog(data, sok, symdiag) {
    const time = new Date(Date.now());
    return Buffer.from(`${time.getFullYear()}年${time.getMonth() + 1}月${time.getDate()}日 ${time.toLocaleTimeString()}\n${symdiag.tp} ${symdiag.sym.description}\n内容：${data.toString()}\n${sok.address().address} from ${getcity(sok)}\n\n`);
}
exports.genlog = genlog;
function writelog(data, sok, sym) {
    const stream = (0, fs_1.openSync)(constants_1.dialogpath, 'a');
    switch (sym) {
        case constants_1.ok:
            (0, fs_1.writeFileSync)(stream, genlog(data, sok, constants_1.okdiag), {
                encoding: constants_1.encoding
            });
            break;
        case constants_1.code_illegal:
            (0, fs_1.writeFileSync)(stream, genlog(data, sok, constants_1.codeIllegalDiag), {
                encoding: constants_1.encoding
            });
            break;
        case constants_1.code_length_illegal:
            (0, fs_1.writeFileSync)(stream, genlog(data, sok, constants_1.codeLengthIllegalDiag), {
                encoding: constants_1.encoding
            });
            break;
        case constants_1.ipv6:
            (0, fs_1.writeFileSync)(stream, genlog(data, sok, constants_1.ipv6diag), {
                encoding: constants_1.encoding
            });
    }
}
exports.writelog = writelog;
