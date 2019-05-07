  // [pawa]
  //   replace 'class @Codewave' 'class Codewave():'
  //   replace /cpos.(\w+)/ cpos['$1']
  //   replace 'new Codewave(' Codewave(
  //   replace '@Codewave.init = ->' 'def init():'
import {
  Process
} from './Process';

import {
  Context
} from './Context';

import {
  PositionedCmdInstance
} from './PositionedCmdInstance';

import {
  TextParser
} from './TextParser';

import {
  Command
} from './Command';

import {
  Logger
} from './Logger';

import {
  PosCollection
} from './positioning/PosCollection';

import {
  StringHelper
} from './helpers/StringHelper';

export var Codewave = (function() {
  class Codewave {
    constructor(editor, options = {}) {
      var defaults, key, val;
      this.editor = editor;
      Codewave.init();
      this.marker = '[[[[codewave_marquer]]]]';
      this.vars = {};
      defaults = {
        'brakets': '~~',
        'deco': '~',
        'closeChar': '/',
        'noExecuteChar': '!',
        'carretChar': '|',
        'checkCarret': true,
        'inInstance': null
      };
      this.parent = options['parent'];
      this.nested = this.parent != null ? this.parent.nested + 1 : 0;
      for (key in defaults) {
        val = defaults[key];
        if (key in options) {
          this[key] = options[key];
        } else if ((this.parent != null) && key !== 'parent') {
          this[key] = this.parent[key];
        } else {
          this[key] = val;
        }
      }
      if (this.editor != null) {
        this.editor.bindedTo(this);
      }
      this.context = new Context(this);
      if (this.inInstance != null) {
        this.context.parent = this.inInstance.context;
      }
      this.logger = new Logger();
    }

    onActivationKey() {
      this.process = new Process();
      this.logger.log('activation key');
      this.runAtCursorPos();
      // Codewave.logger.resume()
      return this.process = null;
    }

    runAtCursorPos() {
      if (this.editor.allowMultiSelection()) {
        return this.runAtMultiPos(this.editor.getMultiSel());
      } else {
        return this.runAtPos(this.editor.getCursorPos());
      }
    }

    runAtPos(pos) {
      return this.runAtMultiPos([pos]);
    }

    runAtMultiPos(multiPos) {
      var cmd;
      if (multiPos.length > 0) {
        cmd = this.commandOnPos(multiPos[0].end);
        if (cmd != null) {
          if (multiPos.length > 1) {
            cmd.setMultiPos(multiPos);
          }
          cmd.init();
          this.logger.log(cmd);
          return cmd.execute();
        } else {
          if (multiPos[0].start === multiPos[0].end) {
            return this.addBrakets(multiPos);
          } else {
            return this.promptClosingCmd(multiPos);
          }
        }
      }
    }

    commandOnPos(pos) {
      var next, prev;
      if (this.precededByBrakets(pos) && this.followedByBrakets(pos) && this.countPrevBraket(pos) % 2 === 1) {
        prev = pos - this.brakets.length;
        next = pos;
      } else {
        if (this.precededByBrakets(pos) && this.countPrevBraket(pos) % 2 === 0) {
          pos -= this.brakets.length;
        }
        prev = this.findPrevBraket(pos);
        if (prev == null) {
          return null;
        }
        next = this.findNextBraket(pos - 1);
        if ((next == null) || this.countPrevBraket(prev) % 2 !== 0) {
          return null;
        }
      }
      return new PositionedCmdInstance(this, prev, this.editor.textSubstr(prev, next + this.brakets.length));
    }

    nextCmd(start = 0) {
      var beginning, f, pos;
      pos = start;
      while (f = this.findAnyNext(pos, [this.brakets, "\n"])) {
        pos = f.pos + f.str.length;
        if (f.str === this.brakets) {
          if (typeof beginning !== "undefined" && beginning !== null) {
            return new PositionedCmdInstance(this, beginning, this.editor.textSubstr(beginning, f.pos + this.brakets.length));
          } else {
            beginning = f.pos;
          }
        } else {
          beginning = null;
        }
      }
      return null;
    }

    getEnclosingCmd(pos = 0) {
      var closingPrefix, cmd, cpos, p;
      cpos = pos;
      closingPrefix = this.brakets + this.closeChar;
      while ((p = this.findNext(cpos, closingPrefix)) != null) {
        if (cmd = this.commandOnPos(p + closingPrefix.length)) {
          cpos = cmd.getEndPos();
          if (cmd.pos < pos) {
            return cmd;
          }
        } else {
          cpos = p + closingPrefix.length;
        }
      }
      return null;
    }

    precededByBrakets(pos) {
      return this.editor.textSubstr(pos - this.brakets.length, pos) === this.brakets;
    }

    followedByBrakets(pos) {
      return this.editor.textSubstr(pos, pos + this.brakets.length) === this.brakets;
    }

    countPrevBraket(start) {
      var i;
      i = 0;
      while ((start = this.findPrevBraket(start)) != null) {
        i++;
      }
      return i;
    }

    isEndLine(pos) {
      return this.editor.textSubstr(pos, pos + 1) === "\n" || pos + 1 >= this.editor.textLen();
    }

    findPrevBraket(start) {
      return this.findNextBraket(start, -1);
    }

    findNextBraket(start, direction = 1) {
      var f;
      f = this.findAnyNext(start, [this.brakets, "\n"], direction);
      if (f && f.str === this.brakets) {
        return f.pos;
      }
    }

    findPrev(start, string) {
      return this.findNext(start, string, -1);
    }

    findNext(start, string, direction = 1) {
      var f;
      f = this.findAnyNext(start, [string], direction);
      if (f) {
        return f.pos;
      }
    }

    findAnyNext(start, strings, direction = 1) {
      return this.editor.findAnyNext(start, strings, direction);
    }

    findMatchingPair(startPos, opening, closing, direction = 1) {
      var f, nested, pos;
      pos = startPos;
      nested = 0;
      while (f = this.findAnyNext(pos, [closing, opening], direction)) {
        pos = f.pos + (direction > 0 ? f.str.length : 0);
        if (f.str === (direction > 0 ? closing : opening)) {
          if (nested > 0) {
            nested--;
          } else {
            return f;
          }
        } else {
          nested++;
        }
      }
      return null;
    }

    addBrakets(pos) {
      var replacements;
      pos = new PosCollection(pos);
      replacements = pos.wrap(this.brakets, this.brakets).map(function(r) {
        return r.selectContent();
      });
      return this.editor.applyReplacements(replacements);
    }

    promptClosingCmd(selections) {
      if (this.closingPromp != null) {
        this.closingPromp.stop();
      }
      return this.closingPromp = Codewave.ClosingPromp.newFor(this, selections).begin(); // [pawa python] replace /\(new (.*)\).begin/ $1.begin reparse
    }

    parseAll(recursive = true) {
      var cmd, parser, pos;
      if (this.nested > 100) {
        throw "Infinite parsing Recursion";
      }
      pos = 0;
      while (cmd = this.nextCmd(pos)) {
        pos = cmd.getEndPos();
        this.editor.setCursorPos(pos);
        // console.log(cmd)
        cmd.init();
        if (recursive && (cmd.content != null) && ((cmd.getCmd() == null) || !cmd.getOption('preventParseAll'))) {
          parser = new Codewave(new TextParser(cmd.content), {
            parent: this
          });
          cmd.content = parser.parseAll();
        }
        if (cmd.execute() != null) {
          if (cmd.replaceEnd != null) {
            pos = cmd.replaceEnd;
          } else {
            pos = this.editor.getCursorPos().end;
          }
        }
      }
      return this.getText();
    }

    getText() {
      return this.editor.text();
    }

    isRoot() {
      return (this.parent == null) && ((this.inInstance == null) || (this.inInstance.finder == null));
    }

    getRoot() {
      if (this.isRoot) {
        return this;
      } else if (this.parent != null) {
        return this.parent.getRoot();
      } else if (this.inInstance != null) {
        return this.inInstance.codewave.getRoot();
      }
    }

    removeCarret(txt) {
      return StringHelper.removeCarret(txt, this.carretChar);
    }

    getCarretPos(txt) {
      return StringHelper.getCarretPos(txt, this.carretChar);
    }

    regMarker(flags = "g") { // [pawa python] replace flags="g" flags=0 
      return new RegExp(StringHelper.escapeRegExp(this.marker), flags);
    }

    removeMarkers(text) {
      return text.replace(this.regMarker(), ''); // [pawa python] replace @regMarker() self.marker 
    }

    static init() {
      if (!this.inited) {
        this.inited = true;
        Command.initCmds();
        return Command.loadCmds();
      }
    }

  };

  Codewave.inited = false;

  return Codewave;

}).call(this);

//# sourceMappingURL=maps/Codewave.js.map
