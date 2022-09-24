"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rsvdt_first = void 0;
var constants_1 = require("./constants");
function rsvdt_first(data) {
    for (var _i = 0, prechecks_1 = prechecks; _i < prechecks_1.length; _i++) {
        var fn = prechecks_1[_i];
        var s = fn(data);
        if (s !== constants_1.ok) {
            return s;
        }
    }
    return constants_1.ok;
}
exports.rsvdt_first = rsvdt_first;
var prechecks = [code_existence];
var allows = [];
for (var _i = 0, _a = constants_1.typecode.types; _i < _a.length; _i++) {
    var types = _a[_i];
    if (types.name === 'player') {
        for (var _b = 0, _c = types.codes; _b < _c.length; _b++) {
            var p = _c[_b];
            allows.push(p.code);
        }
    }
}
function code_existence(data) {
    if (data.length != 4)
        return constants_1.code_length_illegal;
    var code = data.readInt32LE(0);
    return allows.indexOf(code) != -1 ? constants_1.ok : constants_1.code_illegal;
}
