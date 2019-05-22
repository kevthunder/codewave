"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TestMultiEditor = void 0;

var _Pos = require("../../lib/positioning/Pos");

var _TextParser = require("../../lib/TextParser");

var TestMultiEditor = class TestMultiEditor extends _TextParser.TextParser {
  constructor(target) {
    super(target);
    this.selections = [];
    this.changeListeners = [];
  }

  allowMultiSelection() {
    return true;
  }

  getCursorPos() {
    var res;
    res = super.getCursorPos();

    if (res != null) {
      return res;
    } else {
      return new _Pos.Pos(0, 0);
    }
  }

  setCursorPos(start, end) {
    var old;

    if (arguments.length < 2) {
      end = start;
    }

    old = this.getCursorPos();

    if (start !== old.start || end !== old.end) {
      super.setCursorPos(start, end);
      return this.selections = [new _Pos.Pos(start, end)];
    }
  }

  setMultiSel(selections) {
    if (selections.length > 0) {
      this.setCursorPos(selections[0].start, selections[0].end);
    }

    return this.selections = selections.map(function (s) {
      return s.copy();
    });
  }

  textEventChange() {
    return false;
  }

  getMultiSel() {
    var selections;
    selections = this.selections;
    selections[0] = this.getCursorPos();
    return selections;
  }

  addSel(start, end) {
    return this.selections.push(new _Pos.Pos(start, end));
  }

  resetSel(start, end) {
    return this.selections = [this.getCursorPos()];
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
exports.TestMultiEditor = TestMultiEditor;
//# sourceMappingURL=../maps/testHelpers/TestMultiEditor.js.map