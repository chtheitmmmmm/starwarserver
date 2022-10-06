"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invincible_time = exports.codeLengthIllegalDiag = exports.codeIllegalDiag = exports.ipv6diag = exports.okdiag = exports.ipv6 = exports.code_length_illegal = exports.code_illegal = exports.ok = exports.typecode = exports.dialogpath = exports.encoding = exports.max_player_num = exports.port = void 0;
const fs_1 = require("fs");
exports.port = 9800;
exports.max_player_num = 5;
exports.encoding = 'utf-8';
const typecodepath = "../typecode.json";
exports.dialogpath = '../logs.txt';
exports.typecode = JSON.parse((0, fs_1.readFileSync)(typecodepath).toString('utf-8'));
exports.ok = Symbol('正常');
exports.code_illegal = Symbol('不合法的类型代码');
exports.code_length_illegal = Symbol("代码长度不合法");
exports.ipv6 = Symbol("来自IPV6!");
exports.okdiag = {
    tp: 'success',
    sym: exports.ok
};
exports.ipv6diag = {
    tp: "error",
    sym: exports.ipv6
};
exports.codeIllegalDiag = {
    tp: 'error',
    sym: exports.code_illegal
};
exports.codeLengthIllegalDiag = {
    tp: "error",
    sym: exports.code_length_illegal
};
exports.invincible_time = 3000;
