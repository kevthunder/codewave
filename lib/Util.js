// [pawa python]
//   replace Codewave.util. ''
var AddModule, OptionObject;

OptionObject = class OptionObject {
  setOpts(options, defaults) {
    var key, ref, results, val;
    this.defaults = defaults;
    ref = this.defaults;
    results = [];
    for (key in ref) {
      val = ref[key];
      if (key in options) {
        results.push(this.setOpt(key, options[key]));
      } else {
        results.push(this.setOpt(key, val));
      }
    }
    return results;
  }

  setOpt(key, val) {
    var ref;
    if (((ref = this[key]) != null ? ref.call : void 0) != null) {
      return this[key](val);
    } else {
      return this[key] = val;
    }
  }

  getOpt(key) {
    var ref;
    if (((ref = this[key]) != null ? ref.call : void 0) != null) {
      return this[key]();
    } else {
      return this[key];
    }
  }

  getOpts() {
    var key, opts, ref, val;
    opts = {};
    ref = this.defaults;
    for (key in ref) {
      val = ref[key];
      opts[key] = this.getOpt(key);
    }
    return opts;
  }

};

AddModule = function(self, module) {
  var key, ref, results, value;
  if (!module) {
    throw 'AddModule requires module';
  }
  ref = module.prototype;
  results = [];
  for (key in ref) {
    value = ref[key];
    results.push(self.prototype[key] = value);
  }
  return results;
};

this.Codewave.util = {
  splitFirstNamespace: function(fullname, isSpace = false) {
    var parts;
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
  isArray: function(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
  },
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
  merge: function(...xs) {
    if ((xs != null ? xs.length : void 0) > 0) {
      return Codewave.util.tap({}, function(m) {
        var k, l, len, results, v, x;
        results = [];
        for (l = 0, len = xs.length; l < len; l++) {
          x = xs[l];
          results.push((function() {
            var results1;
            results1 = [];
            for (k in x) {
              v = x[k];
              results1.push(m[k] = v);
            }
            return results1;
          })());
        }
        return results;
      });
    }
  },
  tap: function(o, fn) {
    fn(o);
    return o;
  }
};

//# sourceMappingURL=maps/Util.js.map
