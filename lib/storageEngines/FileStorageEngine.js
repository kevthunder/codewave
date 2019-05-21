"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileStorageEngine = void 0;
var fs, util;
fs = require('fs');
util = require('util');
var FileStorageEngine = class FileStorageEngine {
  constructor(file) {
    this.file = file;
  }

  save(key, val) {
    return this.readFile().catch(function () {
      return {};
    }).then(function (content) {
      var cur, i, last, len, part, parts;
      parts = key.split('.');
      last = parts.pop();
      cur = content;

      for (i = 0, len = parts.length; i < len; i++) {
        part = parts[i];

        if (typeof cur[part] !== "object") {
          cur = cur[part] = {};
        } else {
          cur = cur[part];
        }
      }

      cur[last] = val;
      return this.writeFile(content);
    });
  }

  load(key) {
    return this.readFile().then(function (content) {
      var cur, i, len, part, parts;
      parts = key.split('.');
      cur = content;

      for (i = 0, len = parts.length; i < len; i++) {
        part = parts[i];

        if (typeof cur[part] === "undefined") {
          return void 0;
        } else {
          cur = cur[part];
        }
      }
    });
  }

  readFile() {
    return util.promisify(fs.readFile(this.file)).then(function (raw) {
      return JSON.parse(raw);
    });
  }

  writeFile(content1) {
    this.content = content1;
    return util.promisify(fs.writeFile(this.file, JSON.stringify(this.content)));
  }

};
exports.FileStorageEngine = FileStorageEngine;
//# sourceMappingURL=../maps/storageEngines/FileStorageEngine.js.map
