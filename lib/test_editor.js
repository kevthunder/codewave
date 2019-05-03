this.Codewave.TestEditor = class TestEditor extends Codewave.TextAreaEditor {
  constructor(target) {
    super(target);
    this.selections = [];
  }

  allowMultiSelection() {
    return true;
  }

  setCursorPos(start, end) {
    var old;
    if (arguments.length < 2) {
      end = start;
    }
    old = this.getCursorPos();
    if (start !== old.start || end !== old.end) {
      super.setCursorPos(start, end);
      return this.selections = [new Codewave.util.Pos(start, end)];
    }
  }

  setMultiSel(selections) {
    if (selections.length > 0) {
      this.setCursorPos(selections[0].start, selections[0].end);
    }
    return this.selections = selections.map(function(s) {
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
    return this.selections.push(new Codewave.util.Pos(start, end));
  }

  resetSel(start, end) {
    return this.selections = [this.getCursorPos()];
  }

};

//# sourceMappingURL=maps/test_editor.js.map
