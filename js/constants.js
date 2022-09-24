"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.codeLengthIllegalDiag = exports.codeIllegalDiag = exports.ipv6diag = exports.okdiag = exports.ipv6 = exports.code_length_illegal = exports.code_illegal = exports.ok = exports.typecode = exports.dialogpath = exports.player_hp = exports.plane_size = exports.FPS = exports.window_size = exports.enemyGenInterval = exports.encoding = exports.max_player_num = exports.room_pool_len = exports.data_length = exports.v1len = exports.port = void 0;
var fs_1 = require("fs");
exports.port = 9800;
exports.v1len = 36;
exports.data_length = 53;
exports.room_pool_len = 20;
exports.max_player_num = 5;
exports.encoding = 'utf-8';
exports.enemyGenInterval = {
    easy: 3000,
    medium: 2000,
    difficult: 1000
};
exports.window_size = {
    x: 640,
    y: 797
};
exports.FPS = 60;
exports.plane_size = {
    x: 128,
    y: 128
};
exports.player_hp = 100;
var typecodepath = "../typecode.json";
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
