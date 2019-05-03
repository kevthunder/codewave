(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// [pawa]
//   replace 'class @Codewave' 'class Codewave():'
//   replace /cpos.(\w+)/ cpos['$1']
//   replace 'new Codewave(' Codewave(
//   replace '@Codewave.init = ->' 'def init():'
this.Codewave = class Codewave {
  constructor(editor, options = {}) {
    var defaults, key, val;
    this.editor = editor;
    Codewave.init();
    // Codewave.logger.toMonitor(this,'runAtCursorPos')
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
    this.context = new Codewave.Context(this);
    if (this.inInstance != null) {
      this.context.parent = this.inInstance.context;
    }
  }

  onActivationKey() {
    this.process = new Codewave.Process();
    Codewave.logger.log('activation key');
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
        Codewave.logger.log(cmd);
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
    return new Codewave.PositionedCmdInstance(this, prev, this.editor.textSubstr(prev, next + this.brakets.length));
  }

  nextCmd(start = 0) {
    var beginning, f, pos;
    pos = start;
    while (f = this.findAnyNext(pos, [this.brakets, "\n"])) {
      pos = f.pos + f.str.length;
      if (f.str === this.brakets) {
        if (typeof beginning !== "undefined" && beginning !== null) {
          return new Codewave.PositionedCmdInstance(this, beginning, this.editor.textSubstr(beginning, f.pos + this.brakets.length));
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
    pos = Codewave.util.posCollection(pos);
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
        parser = new Codewave(new Codewave.TextParser(cmd.content), {
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
    return Codewave.util.removeCarret(txt, this.carretChar);
  }

  getCarretPos(txt) {
    return Codewave.util.getCarretPos(txt, this.carretChar);
  }

  regMarker(flags = "g") { // [pawa python] replace flags="g" flags=0 
    return new RegExp(Codewave.util.escapeRegExp(this.marker), flags);
  }

  removeMarkers(text) {
    return text.replace(this.regMarker(), ''); // [pawa python] replace @regMarker() self.marker 
  }

};

this.Codewave.inited = false;

this.Codewave.init = function() {
  if (!Codewave.inited) {
    Codewave.inited = true;
    Codewave.Command.initCmds();
    return Codewave.Command.loadCmds();
  }
};



},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvY29kZXdhdmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvLyBbcGF3YV1cbi8vICAgcmVwbGFjZSAnY2xhc3MgQENvZGV3YXZlJyAnY2xhc3MgQ29kZXdhdmUoKTonXG4vLyAgIHJlcGxhY2UgL2Nwb3MuKFxcdyspLyBjcG9zWyckMSddXG4vLyAgIHJlcGxhY2UgJ25ldyBDb2Rld2F2ZSgnIENvZGV3YXZlKFxuLy8gICByZXBsYWNlICdAQ29kZXdhdmUuaW5pdCA9IC0+JyAnZGVmIGluaXQoKTonXG50aGlzLkNvZGV3YXZlID0gY2xhc3MgQ29kZXdhdmUge1xuICBjb25zdHJ1Y3RvcihlZGl0b3IsIG9wdGlvbnMgPSB7fSkge1xuICAgIHZhciBkZWZhdWx0cywga2V5LCB2YWw7XG4gICAgdGhpcy5lZGl0b3IgPSBlZGl0b3I7XG4gICAgQ29kZXdhdmUuaW5pdCgpO1xuICAgIC8vIENvZGV3YXZlLmxvZ2dlci50b01vbml0b3IodGhpcywncnVuQXRDdXJzb3JQb3MnKVxuICAgIHRoaXMubWFya2VyID0gJ1tbW1tjb2Rld2F2ZV9tYXJxdWVyXV1dXSc7XG4gICAgdGhpcy52YXJzID0ge307XG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICAnYnJha2V0cyc6ICd+ficsXG4gICAgICAnZGVjbyc6ICd+JyxcbiAgICAgICdjbG9zZUNoYXInOiAnLycsXG4gICAgICAnbm9FeGVjdXRlQ2hhcic6ICchJyxcbiAgICAgICdjYXJyZXRDaGFyJzogJ3wnLFxuICAgICAgJ2NoZWNrQ2FycmV0JzogdHJ1ZSxcbiAgICAgICdpbkluc3RhbmNlJzogbnVsbFxuICAgIH07XG4gICAgdGhpcy5wYXJlbnQgPSBvcHRpb25zWydwYXJlbnQnXTtcbiAgICB0aGlzLm5lc3RlZCA9IHRoaXMucGFyZW50ICE9IG51bGwgPyB0aGlzLnBhcmVudC5uZXN0ZWQgKyAxIDogMDtcbiAgICBmb3IgKGtleSBpbiBkZWZhdWx0cykge1xuICAgICAgdmFsID0gZGVmYXVsdHNba2V5XTtcbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgICB9IGVsc2UgaWYgKCh0aGlzLnBhcmVudCAhPSBudWxsKSAmJiBrZXkgIT09ICdwYXJlbnQnKSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHRoaXMucGFyZW50W2tleV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzW2tleV0gPSB2YWw7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLmVkaXRvciAhPSBudWxsKSB7XG4gICAgICB0aGlzLmVkaXRvci5iaW5kZWRUbyh0aGlzKTtcbiAgICB9XG4gICAgdGhpcy5jb250ZXh0ID0gbmV3IENvZGV3YXZlLkNvbnRleHQodGhpcyk7XG4gICAgaWYgKHRoaXMuaW5JbnN0YW5jZSAhPSBudWxsKSB7XG4gICAgICB0aGlzLmNvbnRleHQucGFyZW50ID0gdGhpcy5pbkluc3RhbmNlLmNvbnRleHQ7XG4gICAgfVxuICB9XG5cbiAgb25BY3RpdmF0aW9uS2V5KCkge1xuICAgIHRoaXMucHJvY2VzcyA9IG5ldyBDb2Rld2F2ZS5Qcm9jZXNzKCk7XG4gICAgQ29kZXdhdmUubG9nZ2VyLmxvZygnYWN0aXZhdGlvbiBrZXknKTtcbiAgICB0aGlzLnJ1bkF0Q3Vyc29yUG9zKCk7XG4gICAgLy8gQ29kZXdhdmUubG9nZ2VyLnJlc3VtZSgpXG4gICAgcmV0dXJuIHRoaXMucHJvY2VzcyA9IG51bGw7XG4gIH1cblxuICBydW5BdEN1cnNvclBvcygpIHtcbiAgICBpZiAodGhpcy5lZGl0b3IuYWxsb3dNdWx0aVNlbGVjdGlvbigpKSB7XG4gICAgICByZXR1cm4gdGhpcy5ydW5BdE11bHRpUG9zKHRoaXMuZWRpdG9yLmdldE11bHRpU2VsKCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5ydW5BdFBvcyh0aGlzLmVkaXRvci5nZXRDdXJzb3JQb3MoKSk7XG4gICAgfVxuICB9XG5cbiAgcnVuQXRQb3MocG9zKSB7XG4gICAgcmV0dXJuIHRoaXMucnVuQXRNdWx0aVBvcyhbcG9zXSk7XG4gIH1cblxuICBydW5BdE11bHRpUG9zKG11bHRpUG9zKSB7XG4gICAgdmFyIGNtZDtcbiAgICBpZiAobXVsdGlQb3MubGVuZ3RoID4gMCkge1xuICAgICAgY21kID0gdGhpcy5jb21tYW5kT25Qb3MobXVsdGlQb3NbMF0uZW5kKTtcbiAgICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgICBpZiAobXVsdGlQb3MubGVuZ3RoID4gMSkge1xuICAgICAgICAgIGNtZC5zZXRNdWx0aVBvcyhtdWx0aVBvcyk7XG4gICAgICAgIH1cbiAgICAgICAgY21kLmluaXQoKTtcbiAgICAgICAgQ29kZXdhdmUubG9nZ2VyLmxvZyhjbWQpO1xuICAgICAgICByZXR1cm4gY21kLmV4ZWN1dGUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChtdWx0aVBvc1swXS5zdGFydCA9PT0gbXVsdGlQb3NbMF0uZW5kKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuYWRkQnJha2V0cyhtdWx0aVBvcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucHJvbXB0Q2xvc2luZ0NtZChtdWx0aVBvcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb21tYW5kT25Qb3MocG9zKSB7XG4gICAgdmFyIG5leHQsIHByZXY7XG4gICAgaWYgKHRoaXMucHJlY2VkZWRCeUJyYWtldHMocG9zKSAmJiB0aGlzLmZvbGxvd2VkQnlCcmFrZXRzKHBvcykgJiYgdGhpcy5jb3VudFByZXZCcmFrZXQocG9zKSAlIDIgPT09IDEpIHtcbiAgICAgIHByZXYgPSBwb3MgLSB0aGlzLmJyYWtldHMubGVuZ3RoO1xuICAgICAgbmV4dCA9IHBvcztcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMucHJlY2VkZWRCeUJyYWtldHMocG9zKSAmJiB0aGlzLmNvdW50UHJldkJyYWtldChwb3MpICUgMiA9PT0gMCkge1xuICAgICAgICBwb3MgLT0gdGhpcy5icmFrZXRzLmxlbmd0aDtcbiAgICAgIH1cbiAgICAgIHByZXYgPSB0aGlzLmZpbmRQcmV2QnJha2V0KHBvcyk7XG4gICAgICBpZiAocHJldiA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgbmV4dCA9IHRoaXMuZmluZE5leHRCcmFrZXQocG9zIC0gMSk7XG4gICAgICBpZiAoKG5leHQgPT0gbnVsbCkgfHwgdGhpcy5jb3VudFByZXZCcmFrZXQocHJldikgJSAyICE9PSAwKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3IENvZGV3YXZlLlBvc2l0aW9uZWRDbWRJbnN0YW5jZSh0aGlzLCBwcmV2LCB0aGlzLmVkaXRvci50ZXh0U3Vic3RyKHByZXYsIG5leHQgKyB0aGlzLmJyYWtldHMubGVuZ3RoKSk7XG4gIH1cblxuICBuZXh0Q21kKHN0YXJ0ID0gMCkge1xuICAgIHZhciBiZWdpbm5pbmcsIGYsIHBvcztcbiAgICBwb3MgPSBzdGFydDtcbiAgICB3aGlsZSAoZiA9IHRoaXMuZmluZEFueU5leHQocG9zLCBbdGhpcy5icmFrZXRzLCBcIlxcblwiXSkpIHtcbiAgICAgIHBvcyA9IGYucG9zICsgZi5zdHIubGVuZ3RoO1xuICAgICAgaWYgKGYuc3RyID09PSB0aGlzLmJyYWtldHMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBiZWdpbm5pbmcgIT09IFwidW5kZWZpbmVkXCIgJiYgYmVnaW5uaW5nICE9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBDb2Rld2F2ZS5Qb3NpdGlvbmVkQ21kSW5zdGFuY2UodGhpcywgYmVnaW5uaW5nLCB0aGlzLmVkaXRvci50ZXh0U3Vic3RyKGJlZ2lubmluZywgZi5wb3MgKyB0aGlzLmJyYWtldHMubGVuZ3RoKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYmVnaW5uaW5nID0gZi5wb3M7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJlZ2lubmluZyA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZ2V0RW5jbG9zaW5nQ21kKHBvcyA9IDApIHtcbiAgICB2YXIgY2xvc2luZ1ByZWZpeCwgY21kLCBjcG9zLCBwO1xuICAgIGNwb3MgPSBwb3M7XG4gICAgY2xvc2luZ1ByZWZpeCA9IHRoaXMuYnJha2V0cyArIHRoaXMuY2xvc2VDaGFyO1xuICAgIHdoaWxlICgocCA9IHRoaXMuZmluZE5leHQoY3BvcywgY2xvc2luZ1ByZWZpeCkpICE9IG51bGwpIHtcbiAgICAgIGlmIChjbWQgPSB0aGlzLmNvbW1hbmRPblBvcyhwICsgY2xvc2luZ1ByZWZpeC5sZW5ndGgpKSB7XG4gICAgICAgIGNwb3MgPSBjbWQuZ2V0RW5kUG9zKCk7XG4gICAgICAgIGlmIChjbWQucG9zIDwgcG9zKSB7XG4gICAgICAgICAgcmV0dXJuIGNtZDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3BvcyA9IHAgKyBjbG9zaW5nUHJlZml4Lmxlbmd0aDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBwcmVjZWRlZEJ5QnJha2V0cyhwb3MpIHtcbiAgICByZXR1cm4gdGhpcy5lZGl0b3IudGV4dFN1YnN0cihwb3MgLSB0aGlzLmJyYWtldHMubGVuZ3RoLCBwb3MpID09PSB0aGlzLmJyYWtldHM7XG4gIH1cblxuICBmb2xsb3dlZEJ5QnJha2V0cyhwb3MpIHtcbiAgICByZXR1cm4gdGhpcy5lZGl0b3IudGV4dFN1YnN0cihwb3MsIHBvcyArIHRoaXMuYnJha2V0cy5sZW5ndGgpID09PSB0aGlzLmJyYWtldHM7XG4gIH1cblxuICBjb3VudFByZXZCcmFrZXQoc3RhcnQpIHtcbiAgICB2YXIgaTtcbiAgICBpID0gMDtcbiAgICB3aGlsZSAoKHN0YXJ0ID0gdGhpcy5maW5kUHJldkJyYWtldChzdGFydCkpICE9IG51bGwpIHtcbiAgICAgIGkrKztcbiAgICB9XG4gICAgcmV0dXJuIGk7XG4gIH1cblxuICBpc0VuZExpbmUocG9zKSB7XG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yLnRleHRTdWJzdHIocG9zLCBwb3MgKyAxKSA9PT0gXCJcXG5cIiB8fCBwb3MgKyAxID49IHRoaXMuZWRpdG9yLnRleHRMZW4oKTtcbiAgfVxuXG4gIGZpbmRQcmV2QnJha2V0KHN0YXJ0KSB7XG4gICAgcmV0dXJuIHRoaXMuZmluZE5leHRCcmFrZXQoc3RhcnQsIC0xKTtcbiAgfVxuXG4gIGZpbmROZXh0QnJha2V0KHN0YXJ0LCBkaXJlY3Rpb24gPSAxKSB7XG4gICAgdmFyIGY7XG4gICAgZiA9IHRoaXMuZmluZEFueU5leHQoc3RhcnQsIFt0aGlzLmJyYWtldHMsIFwiXFxuXCJdLCBkaXJlY3Rpb24pO1xuICAgIGlmIChmICYmIGYuc3RyID09PSB0aGlzLmJyYWtldHMpIHtcbiAgICAgIHJldHVybiBmLnBvcztcbiAgICB9XG4gIH1cblxuICBmaW5kUHJldihzdGFydCwgc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuZmluZE5leHQoc3RhcnQsIHN0cmluZywgLTEpO1xuICB9XG5cbiAgZmluZE5leHQoc3RhcnQsIHN0cmluZywgZGlyZWN0aW9uID0gMSkge1xuICAgIHZhciBmO1xuICAgIGYgPSB0aGlzLmZpbmRBbnlOZXh0KHN0YXJ0LCBbc3RyaW5nXSwgZGlyZWN0aW9uKTtcbiAgICBpZiAoZikge1xuICAgICAgcmV0dXJuIGYucG9zO1xuICAgIH1cbiAgfVxuXG4gIGZpbmRBbnlOZXh0KHN0YXJ0LCBzdHJpbmdzLCBkaXJlY3Rpb24gPSAxKSB7XG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yLmZpbmRBbnlOZXh0KHN0YXJ0LCBzdHJpbmdzLCBkaXJlY3Rpb24pO1xuICB9XG5cbiAgZmluZE1hdGNoaW5nUGFpcihzdGFydFBvcywgb3BlbmluZywgY2xvc2luZywgZGlyZWN0aW9uID0gMSkge1xuICAgIHZhciBmLCBuZXN0ZWQsIHBvcztcbiAgICBwb3MgPSBzdGFydFBvcztcbiAgICBuZXN0ZWQgPSAwO1xuICAgIHdoaWxlIChmID0gdGhpcy5maW5kQW55TmV4dChwb3MsIFtjbG9zaW5nLCBvcGVuaW5nXSwgZGlyZWN0aW9uKSkge1xuICAgICAgcG9zID0gZi5wb3MgKyAoZGlyZWN0aW9uID4gMCA/IGYuc3RyLmxlbmd0aCA6IDApO1xuICAgICAgaWYgKGYuc3RyID09PSAoZGlyZWN0aW9uID4gMCA/IGNsb3NpbmcgOiBvcGVuaW5nKSkge1xuICAgICAgICBpZiAobmVzdGVkID4gMCkge1xuICAgICAgICAgIG5lc3RlZC0tO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXN0ZWQrKztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBhZGRCcmFrZXRzKHBvcykge1xuICAgIHZhciByZXBsYWNlbWVudHM7XG4gICAgcG9zID0gQ29kZXdhdmUudXRpbC5wb3NDb2xsZWN0aW9uKHBvcyk7XG4gICAgcmVwbGFjZW1lbnRzID0gcG9zLndyYXAodGhpcy5icmFrZXRzLCB0aGlzLmJyYWtldHMpLm1hcChmdW5jdGlvbihyKSB7XG4gICAgICByZXR1cm4gci5zZWxlY3RDb250ZW50KCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cyk7XG4gIH1cblxuICBwcm9tcHRDbG9zaW5nQ21kKHNlbGVjdGlvbnMpIHtcbiAgICBpZiAodGhpcy5jbG9zaW5nUHJvbXAgIT0gbnVsbCkge1xuICAgICAgdGhpcy5jbG9zaW5nUHJvbXAuc3RvcCgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jbG9zaW5nUHJvbXAgPSBDb2Rld2F2ZS5DbG9zaW5nUHJvbXAubmV3Rm9yKHRoaXMsIHNlbGVjdGlvbnMpLmJlZ2luKCk7IC8vIFtwYXdhIHB5dGhvbl0gcmVwbGFjZSAvXFwobmV3ICguKilcXCkuYmVnaW4vICQxLmJlZ2luIHJlcGFyc2VcbiAgfVxuXG4gIHBhcnNlQWxsKHJlY3Vyc2l2ZSA9IHRydWUpIHtcbiAgICB2YXIgY21kLCBwYXJzZXIsIHBvcztcbiAgICBpZiAodGhpcy5uZXN0ZWQgPiAxMDApIHtcbiAgICAgIHRocm93IFwiSW5maW5pdGUgcGFyc2luZyBSZWN1cnNpb25cIjtcbiAgICB9XG4gICAgcG9zID0gMDtcbiAgICB3aGlsZSAoY21kID0gdGhpcy5uZXh0Q21kKHBvcykpIHtcbiAgICAgIHBvcyA9IGNtZC5nZXRFbmRQb3MoKTtcbiAgICAgIHRoaXMuZWRpdG9yLnNldEN1cnNvclBvcyhwb3MpO1xuICAgICAgLy8gY29uc29sZS5sb2coY21kKVxuICAgICAgY21kLmluaXQoKTtcbiAgICAgIGlmIChyZWN1cnNpdmUgJiYgKGNtZC5jb250ZW50ICE9IG51bGwpICYmICgoY21kLmdldENtZCgpID09IG51bGwpIHx8ICFjbWQuZ2V0T3B0aW9uKCdwcmV2ZW50UGFyc2VBbGwnKSkpIHtcbiAgICAgICAgcGFyc2VyID0gbmV3IENvZGV3YXZlKG5ldyBDb2Rld2F2ZS5UZXh0UGFyc2VyKGNtZC5jb250ZW50KSwge1xuICAgICAgICAgIHBhcmVudDogdGhpc1xuICAgICAgICB9KTtcbiAgICAgICAgY21kLmNvbnRlbnQgPSBwYXJzZXIucGFyc2VBbGwoKTtcbiAgICAgIH1cbiAgICAgIGlmIChjbWQuZXhlY3V0ZSgpICE9IG51bGwpIHtcbiAgICAgICAgaWYgKGNtZC5yZXBsYWNlRW5kICE9IG51bGwpIHtcbiAgICAgICAgICBwb3MgPSBjbWQucmVwbGFjZUVuZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwb3MgPSB0aGlzLmVkaXRvci5nZXRDdXJzb3JQb3MoKS5lbmQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZ2V0VGV4dCgpO1xuICB9XG5cbiAgZ2V0VGV4dCgpIHtcbiAgICByZXR1cm4gdGhpcy5lZGl0b3IudGV4dCgpO1xuICB9XG5cbiAgaXNSb290KCkge1xuICAgIHJldHVybiAodGhpcy5wYXJlbnQgPT0gbnVsbCkgJiYgKCh0aGlzLmluSW5zdGFuY2UgPT0gbnVsbCkgfHwgKHRoaXMuaW5JbnN0YW5jZS5maW5kZXIgPT0gbnVsbCkpO1xuICB9XG5cbiAgZ2V0Um9vdCgpIHtcbiAgICBpZiAodGhpcy5pc1Jvb3QpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wYXJlbnQgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmdldFJvb3QoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaW5JbnN0YW5jZSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbkluc3RhbmNlLmNvZGV3YXZlLmdldFJvb3QoKTtcbiAgICB9XG4gIH1cblxuICByZW1vdmVDYXJyZXQodHh0KSB7XG4gICAgcmV0dXJuIENvZGV3YXZlLnV0aWwucmVtb3ZlQ2FycmV0KHR4dCwgdGhpcy5jYXJyZXRDaGFyKTtcbiAgfVxuXG4gIGdldENhcnJldFBvcyh0eHQpIHtcbiAgICByZXR1cm4gQ29kZXdhdmUudXRpbC5nZXRDYXJyZXRQb3ModHh0LCB0aGlzLmNhcnJldENoYXIpO1xuICB9XG5cbiAgcmVnTWFya2VyKGZsYWdzID0gXCJnXCIpIHsgLy8gW3Bhd2EgcHl0aG9uXSByZXBsYWNlIGZsYWdzPVwiZ1wiIGZsYWdzPTAgXG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoQ29kZXdhdmUudXRpbC5lc2NhcGVSZWdFeHAodGhpcy5tYXJrZXIpLCBmbGFncyk7XG4gIH1cblxuICByZW1vdmVNYXJrZXJzKHRleHQpIHtcbiAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHRoaXMucmVnTWFya2VyKCksICcnKTsgLy8gW3Bhd2EgcHl0aG9uXSByZXBsYWNlIEByZWdNYXJrZXIoKSBzZWxmLm1hcmtlciBcbiAgfVxuXG59O1xuXG50aGlzLkNvZGV3YXZlLmluaXRlZCA9IGZhbHNlO1xuXG50aGlzLkNvZGV3YXZlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgaWYgKCFDb2Rld2F2ZS5pbml0ZWQpIHtcbiAgICBDb2Rld2F2ZS5pbml0ZWQgPSB0cnVlO1xuICAgIENvZGV3YXZlLkNvbW1hbmQuaW5pdENtZHMoKTtcbiAgICByZXR1cm4gQ29kZXdhdmUuQ29tbWFuZC5sb2FkQ21kcygpO1xuICB9XG59O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1tYXBzL2NvZGV3YXZlLmpzLm1hcFxuIl19
