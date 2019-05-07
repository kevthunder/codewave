import {
  Pos
} from './Pos';

import {
  CommonHelper
} from '../helpers/CommonHelper';

import {
  OptionObject
} from '../OptionObject';

import {
  StringHelper
} from '../helpers/StringHelper';

export var Replacement = (function() {
  class Replacement extends Pos {
    constructor(start1, end, text1, options = {}) {
      super();
      this.start = start1;
      this.end = end;
      this.text = text1;
      this.options = options;
      this.setOpts(this.options, {
        prefix: '',
        suffix: '',
        selections: []
      });
    }

    resPosBeforePrefix() {
      return this.start + this.prefix.length + this.text.length;
    }

    resEnd() {
      return this.start + this.finalText().length;
    }

    apply() {
      return this.editor().spliceText(this.start, this.end, this.finalText());
    }

    necessary() {
      return this.finalText() !== this.originalText();
    }

    originalText() {
      return this.editor().textSubstr(this.start, this.end);
    }

    finalText() {
      return this.prefix + this.text + this.suffix;
    }

    offsetAfter() {
      return this.finalText().length - (this.end - this.start);
    }

    applyOffset(offset) {
      var i, len, ref, sel;
      if (offset !== 0) {
        this.start += offset;
        this.end += offset;
        ref = this.selections;
        for (i = 0, len = ref.length; i < len; i++) {
          sel = ref[i];
          sel.start += offset;
          sel.end += offset;
        }
      }
      return this;
    }

    selectContent() {
      this.selections = [new Pos(this.prefix.length + this.start, this.prefix.length + this.start + this.text.length)];
      return this;
    }

    carretToSel() {
      var pos, res, start, text;
      this.selections = [];
      text = this.finalText();
      this.prefix = StringHelper.removeCarret(this.prefix);
      this.text = StringHelper.removeCarret(this.text);
      this.suffix = StringHelper.removeCarret(this.suffix);
      start = this.start;
      while ((res = StringHelper.getAndRemoveFirstCarret(text)) != null) {
        [pos, text] = res;
        this.selections.push(new Pos(start + pos, start + pos));
      }
      return this;
    }

    copy() {
      var res;
      res = new Replacement(this.start, this.end, this.text, this.getOpts());
      if (this.hasEditor()) {
        res.withEditor(this.editor());
      }
      res.selections = this.selections.map(function(s) {
        return s.copy();
      });
      return res;
    }

  };

  CommonHelper.applyMixins(Replacement.prototype, [OptionObject]);

  return Replacement;

}).call(this);

//# sourceMappingURL=../maps/positioning/Replacement.js.map
