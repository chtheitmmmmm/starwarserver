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
exports.enemys = exports.Sa_1 = void 0;
var crypto_1 = require("crypto");
var constants_1 = require("./constants");
var constants_2 = require("./constants");
var Sa_1 = (function () {
    function Sa_1() {
        this.hp = 100;
        this.code = 1;
        this.weapon_code = constants_2.typecode.types.find(function (item) {
            return item.name === 'weapon';
        }).codes.find(function (item) {
            return item.name === 'red triangle';
        }).code;
        this.pos = (0, crypto_1.randomInt)(constants_1.window_size.x, constants_1.window_size.y);
    }
    return Sa_1;
}());
exports.Sa_1 = Sa_1;
exports.enemys = new (function (_super) {
    __extends(enemyPool, _super);
    function enemyPool() {
        return _super.call(this) || this;
    }
    enemyPool.prototype.add = function () {
    };
    enemyPool.prototype.destory = function () {
    };
    return enemyPool;
}(Array));
