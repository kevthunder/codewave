

const TextParser = require("./TextParser");

const Pos = require("./positioning/Pos");

var isElement;
var DomKeyListener = class DomKeyListener {
  startListening(target) {
    var onkeydown, onkeypress, onkeyup, timeout;
    timeout = null;

    onkeydown = e => {
      if ((Codewave.instances.length < 2 || this.obj === document.activeElement) && e.keyCode === 69 && e.ctrlKey) {
        e.preventDefault();

        if (this.onActivationKey != null) {
          return this.onActivationKey();
        }
      }
    };

    onkeyup = e => {
      if (this.onAnyChange != null) {
        return this.onAnyChange(e);
      }
    };

    onkeypress = e => {
      if (timeout != null) {
        clearTimeout(timeout);
      }

      return timeout = setTimeout(() => {
        if (this.onAnyChange != null) {
          return this.onAnyChange(e);
        }
      }, 100);
    };

    if (target.addEventListener) {
      target.addEventListener("keydown", onkeydown);
      target.addEventListener("keyup", onkeyup);
      return target.addEventListener("keypress", onkeypress);
    } else if (target.attachEvent) {
      target.attachEvent("onkeydown", onkeydown);
      target.attachEvent("onkeyup", onkeyup);
      return target.attachEvent("onkeypress", onkeypress);
    }
  }

};
exports.DomKeyListener = DomKeyListener;

isElement = function (obj) {
  var e;

  try {
    // Using W3 DOM2 (works for FF, Opera and Chrom)
    return obj instanceof HTMLElement;
  } catch (error) {
    e = error; // Browsers not supporting W3 DOM2 don't have HTMLElement and
    // an exception is thrown and we end up here. Testing some
    // properties that all elements have. (works on IE7)

    return typeof obj === "object" && obj.nodeType === 1 && typeof obj.style === "object" && typeof obj.ownerDocument === "object";
  }
};

var TextAreaEditor = function () {
  class TextAreaEditor extends TextParser.TextParser {
    constructor(target1) {
      super();
      this.target = target1;
      this.obj = isElement(this.target) ? this.target : document.getElementById(this.target);

      if (this.obj == null) {
        throw "TextArea not found";
      }

      this.namespace = 'textarea';
      this.changeListeners = [];
      this._skipChangeEvent = 0;
    }

    onAnyChange(e) {
      var callback, j, len1, ref, results;

      if (this._skipChangeEvent <= 0) {
        ref = this.changeListeners;
        results = [];

        for (j = 0, len1 = ref.length; j < len1; j++) {
          callback = ref[j];
          results.push(callback());
        }

        return results;
      } else {
        this._skipChangeEvent--;

        if (this.onSkipedChange != null) {
          return this.onSkipedChange();
        }
      }
    }

    skipChangeEvent(nb = 1) {
      return this._skipChangeEvent += nb;
    }

    bindedTo(codewave) {
      this.onActivationKey = function () {
        return codewave.onActivationKey();
      };

      return this.startListening(document);
    }

    selectionPropExists() {
      return "selectionStart" in this.obj;
    }

    hasFocus() {
      return document.activeElement === this.obj;
    }

    text(val) {
      if (val != null) {
        if (!this.textEventChange(val)) {
          this.obj.value = val;
        }
      }

      return this.obj.value;
    }

    spliceText(start, end, text) {
      return this.textEventChange(text, start, end) || this.spliceTextWithExecCommand(text, start, end) || super.spliceText(start, end, text);
    }

    textEventChange(text, start = 0, end = null) {
      var event;

      if (document.createEvent != null) {
        event = document.createEvent('TextEvent');
      }

      if (event != null && event.initTextEvent != null && event.isTrusted !== false) {
        if (end == null) {
          end = this.textLen();
        }

        if (text.length < 1) {
          if (start !== 0) {
            text = this.textSubstr(start - 1, start);
            start--;
          } else if (end !== this.textLen()) {
            text = this.textSubstr(end, end + 1);
            end++;
          } else {
            return false;
          }
        }

        event.initTextEvent('textInput', true, true, null, text, 9); // @setCursorPos(start,end)

        this.obj.selectionStart = start;
        this.obj.selectionEnd = end;
        this.obj.dispatchEvent(event);
        this.skipChangeEvent();
        return true;
      } else {
        return false;
      }
    }

    spliceTextWithExecCommand(text, start = 0, end = null) {
      if (document.execCommand != null) {
        if (end == null) {
          end = this.textLen();
        }

        this.obj.selectionStart = start;
        this.obj.selectionEnd = end;
        return document.execCommand('insertText', false, text);
      } else {
        return false;
      }
    }

    getCursorPos() {
      if (this.tmpCursorPos != null) {
        return this.tmpCursorPos;
      }

      if (this.hasFocus) {
        if (this.selectionPropExists) {
          return new Pos.Pos(this.obj.selectionStart, this.obj.selectionEnd);
        } else {
          return this.getCursorPosFallback();
        }
      }
    }

    getCursorPosFallback() {
      var len, pos, rng, sel;

      if (this.obj.createTextRange) {
        sel = document.selection.createRange();

        if (sel.parentElement() === this.obj) {
          rng = this.obj.createTextRange();
          rng.moveToBookmark(sel.getBookmark());
          len = 0;

          while (rng.compareEndPoints("EndToStart", rng) > 0) {
            len++;
            rng.moveEnd("character", -1);
          }

          rng.setEndPoint("StartToStart", this.obj.createTextRange());
          pos = new Pos.Pos(0, len);

          while (rng.compareEndPoints("EndToStart", rng) > 0) {
            pos.start++;
            pos.end++;
            rng.moveEnd("character", -1);
          }

          return pos;
        }
      }
    }

    setCursorPos(start, end) {
      if (arguments.length < 2) {
        end = start;
      }

      if (this.selectionPropExists) {
        this.tmpCursorPos = new Pos.Pos(start, end);
        this.obj.selectionStart = start;
        this.obj.selectionEnd = end;
        setTimeout(() => {
          this.tmpCursorPos = null;
          this.obj.selectionStart = start;
          return this.obj.selectionEnd = end;
        }, 1);
      } else {
        this.setCursorPosFallback(start, end);
      }
    }

    setCursorPosFallback(start, end) {
      var rng;

      if (this.obj.createTextRange) {
        rng = this.obj.createTextRange();
        rng.moveStart("character", start);
        rng.collapse();
        rng.moveEnd("character", end - start);
        return rng.select();
      }
    }

    getLang() {
      if (this._lang) {
        return this._lang;
      }

      if (this.obj.hasAttribute('data-lang')) {
        return this.obj.getAttribute('data-lang');
      }
    }

    setLang(val) {
      this._lang = val;
      return this.obj.setAttribute('data-lang', val);
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

    applyReplacements(replacements) {
      if (replacements.length > 0 && replacements[0].selections.length < 1) {
        replacements[0].selections = [this.getCursorPos()];
      }

      return super.applyReplacements(replacements);
    }

  }

  ;
  TextAreaEditor.prototype.startListening = DomKeyListener.prototype.startListening;
  return TextAreaEditor;
}.call(void 0);

exports.TextAreaEditor = TextAreaEditor;

