"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Storage = void 0;

var _Logger = require("./Logger");

var Storage = class Storage {
  constructor(engine1) {
    this.engine = engine1;
  }

  save(key, val) {
    if (this.engineAvailable()) {
      return this.engine.save(key, val);
    }
  }

  load(key) {
    if (this.engineAvailable()) {
      return this.engine.load(key);
    }
  }

  engineAvailable() {
    if (typeof engine !== "undefined" && engine !== null) {
      return true;
    } else {
      this.logger = this.logger || new _Logger.Logger();
      this.logger.log('No storage engine available');
      return false;
    }
  }

};
exports.Storage = Storage;
//# sourceMappingURL=maps/Storage.js.map
