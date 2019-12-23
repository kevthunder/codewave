

const PosCollection = require("./positioning/PosCollection");

const Replacement = require("./positioning/Replacement");

const Pos = require("./positioning/Pos");

const OptionalPromise = require("./helpers/OptionalPromise");

var ClosingPromp = class ClosingPromp {
  constructor(codewave1, selections) {
    this.codewave = codewave1;
    this.timeout = null;
    this._typed = null;
    this.started = false;
    this.nbChanges = 0;
    this.selections = new PosCollection.PosCollection(selections);
  }

  begin() {
    this.started = true;
    return (0, OptionalPromise.optionalPromise)(this.addCarrets()).then(() => {
      if (this.codewave.editor.canListenToChange()) {
        this.proxyOnChange = (ch = null) => {
          return this.onChange(ch);
        };

        this.codewave.editor.addChangeListener(this.proxyOnChange);
      }

      return this;
    }).result();
  }

  addCarrets() {
    this.replacements = this.selections.wrap(this.codewave.brakets + this.codewave.carretChar + this.codewave.brakets + "\n", "\n" + this.codewave.brakets + this.codewave.closeChar + this.codewave.carretChar + this.codewave.brakets).map(function (p) {
      return p.carretToSel();
    });
    return this.codewave.editor.applyReplacements(this.replacements);
  }

  invalidTyped() {
    return this._typed = null;
  }

  onChange(ch = null) {
    this.invalidTyped();

    if (this.skipEvent(ch)) {
      return;
    }

    this.nbChanges++;

    if (this.shouldStop()) {
      this.stop();
      return this.cleanClose();
    } else {
      return this.resume();
    }
  }

  skipEvent(ch) {
    return ch != null && ch.charCodeAt(0) !== 32;
  }

  resume() {}

  shouldStop() {
    return this.typed() === false || this.typed().indexOf(' ') !== -1;
  }

  cleanClose() {
    var end, j, len, pos, repl, replacements, res, sel, selections, start;
    replacements = [];
    selections = this.getSelections();

    for (j = 0, len = selections.length; j < len; j++) {
      sel = selections[j];

      if (pos = this.whithinOpenBounds(sel)) {
        start = sel;
      } else if ((end = this.whithinCloseBounds(sel)) && start != null) {
        res = end.withEditor(this.codewave.editor).innerText().split(' ')[0];
        repl = new Replacement.Replacement(end.innerStart, end.innerEnd, res);
        repl.selections = [start];
        replacements.push(repl);
        start = null;
      }
    }

    return this.codewave.editor.applyReplacements(replacements);
  }

  getSelections() {
    return this.codewave.editor.getMultiSel();
  }

  stop() {
    this.started = false;

    if (this.timeout != null) {
      clearTimeout(this.timeout);
    }

    if (this.codewave.closingPromp === this) {
      this.codewave.closingPromp = null;
    }

    if (this.proxyOnChange != null) {
      return this.codewave.editor.removeChangeListener(this.proxyOnChange);
    }
  }

  cancel() {
    if (this.typed() !== false) {
      this.cancelSelections(this.getSelections());
    }

    return this.stop();
  }

  cancelSelections(selections) {
    var end, j, len, pos, replacements, sel, start;
    replacements = [];
    start = null;

    for (j = 0, len = selections.length; j < len; j++) {
      sel = selections[j];

      if (pos = this.whithinOpenBounds(sel)) {
        start = pos;
      } else if ((end = this.whithinCloseBounds(sel)) && start != null) {
        replacements.push(new Replacement.Replacement(start.start, end.end, this.codewave.editor.textSubstr(start.end + 1, end.start - 1)).selectContent());
        start = null;
      }
    }

    return this.codewave.editor.applyReplacements(replacements);
  }

  typed() {
    var cpos, innerEnd, innerStart;

    if (this._typed == null) {
      cpos = this.codewave.editor.getCursorPos();
      innerStart = this.replacements[0].start + this.codewave.brakets.length;

      if (this.codewave.findPrevBraket(cpos.start) === this.replacements[0].start && (innerEnd = this.codewave.findNextBraket(innerStart)) != null && innerEnd >= cpos.end) {
        this._typed = this.codewave.editor.textSubstr(innerStart, innerEnd);
      } else {
        this._typed = false;
      }
    }

    return this._typed;
  }

  whithinOpenBounds(pos) {
    var i, j, len, ref, repl, targetPos, targetText;
    ref = this.replacements;

    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      repl = ref[i];
      targetPos = this.startPosAt(i);
      targetText = this.codewave.brakets + this.typed() + this.codewave.brakets;

      if (targetPos.innerContainsPos(pos) && targetPos.withEditor(this.codewave.editor).text() === targetText) {
        return targetPos;
      }
    }

    return false;
  }

  whithinCloseBounds(pos) {
    var i, j, len, ref, repl, targetPos, targetText;
    ref = this.replacements;

    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      repl = ref[i];
      targetPos = this.endPosAt(i);
      targetText = this.codewave.brakets + this.codewave.closeChar + this.typed() + this.codewave.brakets;

      if (targetPos.innerContainsPos(pos) && targetPos.withEditor(this.codewave.editor).text() === targetText) {
        return targetPos;
      }
    }

    return false;
  }

  startPosAt(index) {
    return new Pos.Pos(this.replacements[index].selections[0].start + this.typed().length * (index * 2), this.replacements[index].selections[0].end + this.typed().length * (index * 2 + 1)).wrappedBy(this.codewave.brakets, this.codewave.brakets);
  }

  endPosAt(index) {
    return new Pos.Pos(this.replacements[index].selections[1].start + this.typed().length * (index * 2 + 1), this.replacements[index].selections[1].end + this.typed().length * (index * 2 + 2)).wrappedBy(this.codewave.brakets + this.codewave.closeChar, this.codewave.brakets);
  }

};
exports.ClosingPromp = ClosingPromp;
var SimulatedClosingPromp = class SimulatedClosingPromp extends ClosingPromp {
  resume() {
    return this.simulateType();
  }

  simulateType() {
    if (this.timeout != null) {
      clearTimeout(this.timeout);
    }

    return this.timeout = setTimeout(() => {
      var curClose, repl, targetText;
      this.invalidTyped();
      targetText = this.codewave.brakets + this.codewave.closeChar + this.typed() + this.codewave.brakets;
      curClose = this.whithinCloseBounds(this.replacements[0].selections[1].copy().applyOffset(this.typed().length));

      if (curClose) {
        repl = new Replacement.Replacement(curClose.start, curClose.end, targetText);

        if (repl.withEditor(this.codewave.editor).necessary()) {
          this.codewave.editor.applyReplacements([repl]);
        }
      } else {
        this.stop();
      }

      if (this.onTypeSimulated != null) {
        return this.onTypeSimulated();
      }
    }, 2);
  }

  skipEvent() {
    return false;
  }

  getSelections() {
    return [this.codewave.editor.getCursorPos(), this.replacements[0].selections[1] + this.typed().length];
  }

  whithinCloseBounds(pos) {
    var i, j, len, next, ref, repl, targetPos;
    ref = this.replacements;

    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      repl = ref[i];
      targetPos = this.endPosAt(i);
      next = this.codewave.findNextBraket(targetPos.innerStart);

      if (next != null) {
        targetPos.moveSuffix(next);

        if (targetPos.innerContainsPos(pos)) {
          return targetPos;
        }
      }
    }

    return false;
  }

};
exports.SimulatedClosingPromp = SimulatedClosingPromp;

ClosingPromp.newFor = function (codewave, selections) {
  if (codewave.editor.allowMultiSelection()) {
    return new ClosingPromp(codewave, selections);
  } else {
    return new SimulatedClosingPromp(codewave, selections);
  }
};

