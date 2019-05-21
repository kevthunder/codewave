"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LocalStorageEngine = void 0;
var LocalStorageEngine = class LocalStorageEngine {
  constructor() {}

  save(key, val) {
    if (typeof localStorage !== "undefined" && localStorage !== null) {
      return localStorage.setItem(this.fullKey(key), JSON.stringify(val));
    }
  }

  load(key) {
    if (typeof localStorage !== "undefined" && localStorage !== null) {
      return JSON.parse(localStorage.getItem(this.fullKey(key)));
    }
  }

  fullKey(key) {
    return 'CodeWave_' + key;
  }

};
exports.LocalStorageEngine = LocalStorageEngine;
//# sourceMappingURL=../maps/storageEngines/LocalStorageEngine.js.map
