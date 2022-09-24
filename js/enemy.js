"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.enemys = exports.enemytypes = exports.Sa_1 = void 0;
var constants_1 = require("./constants");
var crypto_1 = require("crypto");
var uuid_1 = require("uuid");
var Sa_1 = (function () {
    function Sa_1(pos) {
        this.hp = 100;
        this.id = (0, uuid_1.v4)();
        this.code = 1;
        this.weapon_code = constants_1.typecode.types.find(function (item) {
            return item.name === 'weapon';
        }).codes.find(function (item) {
            return item.name === 'red triangle';
        }).code;
        this.pos = pos;
    }
    return Sa_1;
}());
exports.Sa_1 = Sa_1;
exports.enemytypes = [Sa_1];
exports.enemys = new (function (_super) {
    __extends(enemyPool, _super);
    function enemyPool() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    enemyPool.prototype.add = function () {
        var planetype = exports.enemytypes[(0, crypto_1.randomInt)(0, exports.enemytypes.length)];
        var plane = new planetype({
            x: (0, crypto_1.randomInt)(0, constants_1.window_size.x - constants_1.plane_size.x),
            y: (0, crypto_1.randomInt)(0, constants_1.window_size.y - constants_1.plane_size.y)
        });
        this.push(plane);
        return plane;
    };
    enemyPool.prototype.destory = function () {
    };
    return enemyPool;
}(Array));
