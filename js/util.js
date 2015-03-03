// Generated by CoffeeScript 1.8.0
(function() {
  var Pos, Size, StrPos, WrappedPos,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  StrPos = (function() {
    function StrPos(pos, str) {
      this.pos = pos;
      this.str = str;
    }

    StrPos.prototype.end = function() {
      return this.pos + this.str.length;
    };

    return StrPos;

  })();

  Pos = (function() {
    function Pos(start, end) {
      this.start = start;
      this.end = end;
    }

    Pos.prototype.containsPt = function(pt) {
      return this.start <= pt && pt <= this.end;
    };

    Pos.prototype.containsPos = function(pos) {
      return this.start <= pos.start && pos.end <= this.end;
    };

    return Pos;

  })();

  WrappedPos = (function(_super) {
    __extends(WrappedPos, _super);

    function WrappedPos(start, innerStart, innerEnd, end) {
      this.start = start;
      this.innerStart = innerStart;
      this.innerEnd = innerEnd;
      this.end = end;
    }

    WrappedPos.prototype.innerContainsPt = function(pt) {
      return this.innerStart <= pt && pt <= this.innerEnd;
    };

    WrappedPos.prototype.innerContainsPos = function(pos) {
      return this.innerStart <= pos.start && pos.end <= this.innerEnd;
    };

    return WrappedPos;

  })(Pos);

  Size = (function() {
    function Size(width, height) {
      this.width = width;
      this.height = height;
    }

    return Size;

  })();

  this.Codewave.util = {
    splitFirstNamespace: function(fullname, isSpace) {
      var parts;
      if (isSpace == null) {
        isSpace = false;
      }
      if (fullname.indexOf(":") === -1 && !isSpace) {
        return [null, fullname];
      }
      parts = fullname.split(':');
      return [parts.shift(), parts.join(':') || null];
    },
    splitNamespace: function(fullname) {
      var name, parts;
      if (fullname.indexOf(":") === -1) {
        return [null, fullname];
      }
      parts = fullname.split(':');
      name = parts.pop();
      return [parts.join(':'), name];
    },
    trimEmptyLine: function(txt) {
      return txt.replace(/^\r?\n/, '').replace(/\r?\n$/, '');
    },
    escapeRegExp: function(str) {
      return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    },
    repeatToLength: function(txt, length) {
      return Array(Math.ceil(length / txt.length) + 1).join(txt).substring(0, length);
    },
    getTxtSize: function(txt) {
      var l, lines, w, _i, _len;
      lines = txt.replace(/\r/g, '').split("\n");
      w = 0;
      for (_i = 0, _len = lines.length; _i < _len; _i++) {
        l = lines[_i];
        w = Math.max(w, l.length);
      }
      return new Size(w, lines.length - 1);
    },
    StrPos: StrPos,
    Pos: Pos,
    WrappedPos: WrappedPos,
    Size: Size,
    union: function(a1, a2) {
      return Codewave.util.unique(a1.concat(a2));
    },
    unique: function(array) {
      var a, i, j;
      a = array.concat();
      i = 0;
      while (i < a.length) {
        j = i + 1;
        while (j < a.length) {
          if (a[i] === a[j]) {
            a.splice(j--, 1);
          }
          ++j;
        }
        ++i;
      }
      return a;
    },
    merge: function() {
      var xs;
      xs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if ((xs != null ? xs.length : void 0) > 0) {
        return Codewave.util.tap({}, function(m) {
          var k, v, x, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = xs.length; _i < _len; _i++) {
            x = xs[_i];
            _results.push((function() {
              var _results1;
              _results1 = [];
              for (k in x) {
                v = x[k];
                _results1.push(m[k] = v);
              }
              return _results1;
            })());
          }
          return _results;
        });
      }
    },
    tap: function(o, fn) {
      fn(o);
      return o;
    }
  };

}).call(this);

//# sourceMappingURL=util.js.map
