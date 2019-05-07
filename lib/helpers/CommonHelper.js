export var CommonHelper = class CommonHelper {
  static merge(...xs) {
    if ((xs != null ? xs.length : void 0) > 0) {
      return this.tap({}, function(m) {
        var i, k, len, results, v, x;
        results = [];
        for (i = 0, len = xs.length; i < len; i++) {
          x = xs[i];
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
  }

  static tap(o, fn) {
    fn(o);
    return o;
  }

  static applyMixins(derivedCtor, baseCtors) {
    return baseCtors.forEach((baseCtor) => {
      return Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
        return Object.defineProperty(derivedCtor, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name));
      });
    });
  }

};

//# sourceMappingURL=../maps/helpers/CommonHelper.js.map
