"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writelog = exports.genlog = exports.getcity = exports.cities = exports.ipip = void 0;
var constants_1 = require("./constants");
var fs_1 = require("fs");
exports.ipip = require('ipip-ipdb');
exports.cities = new exports.ipip.City('../ipipfree.ipdb');
function getcity(sok) {
    if (sok.address().family === 'IPv4') {
        var info = exports.cities.findInfo(sok.address().address, 'CN');
        return "".concat(info.countryName, ", ").concat(info.regionName, ", ").concat(info.cityName);
    }
    else {
        return '未知地址';
    }
}
exports.getcity = getcity;
function genlog(data, sok, symdiag) {
    return Buffer.from("".concat(symdiag.tp, " ").concat(symdiag.sym.description, "\n\u5185\u5BB9\uFF1A").concat(data.toString(), "\n").concat(sok.address().address, " from ").concat(getcity(sok), "\n\n"));
}
exports.genlog = genlog;
function writelog(data, sok, sym) {
    var stream = (0, fs_1.openSync)(constants_1.dialogpath, 'a');
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
