"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rsvdt_first = void 0;
const constants_1 = require("./constants");
function rsvdt_first(data) {
    for (const fn of prechecks) {
        const s = fn(data);
        if (s !== constants_1.ok) {
            return s;
        }
    }
    return constants_1.ok;
}
exports.rsvdt_first = rsvdt_first;
const prechecks = [code_existence];
const allows = [];
for (const types of constants_1.typecode.types) {
    if (types.type === 'player') {
        for (const p of types.codes) {
            allows.push(p.code);
        }
    }
}
function code_existence(data) {
    console.log('hello');
    console.log('resolve', data);
    console.log(data.length);
    if (data.length != 1)
        return constants_1.code_length_illegal;
    const code = data.readInt8(0);
    console.log('get', code);
    return allows.indexOf(code) != -1 ? constants_1.ok : constants_1.code_illegal;
}
