"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TestMonoEditor = void 0;

var _Pos = require("../../lib/positioning/Pos");

var _TextParser = require("../../lib/TextParser");

var TestMonoEditor = class TestMonoEditor extends _TextParser.TextParser {
  constructor(target) {
    super(target);
    this.changeListeners = [];
  }

  canListenToChange() {
    return true;
  }

  addChangeListener(callback) {
    return this.changeListeners.push(callback);
  }

  removeChangeListener(callback) {
    var i;

    if ((i = this.changeListeners.indexOf(callback)) > -1) {
      return this.changeListeners.splice(i, 1);
    }
  }

  onAnyChange(e) {
    var callback, j, len, ref, results;
    ref = this.changeListeners;
    results = [];

    for (j = 0, len = ref.length; j < len; j++) {
      callback = ref[j];
      results.push(callback());
    }

    return results;
  }

};
exports.TestMonoEditor = TestMonoEditor;
//# sourceMappingURL=../maps/testHelpers/TestMonoEditor.js.map
