

const Pos = require("../../lib/positioning/Pos").Pos;

const TextParser = require("../../lib/TextParser").TextParser;

var TestMonoEditor = class TestMonoEditor extends TextParser {
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

