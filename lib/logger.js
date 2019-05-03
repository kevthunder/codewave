this.Codewave.logger = {
  log: function(...args) {
    var i, len, msg, results;
    if (window.console && Codewave.logger.enabled) {
      results = [];
      for (i = 0, len = args.length; i < len; i++) {
        msg = args[i];
        results.push(console.log(msg));
      }
      return results;
    }
  },
  enabled: true,
  runtime: function(funct, name = "function") {
    var res, t0, t1;
    t0 = performance.now();
    res = funct();
    t1 = performance.now();
    console.log(`${name} took ${t1 - t0} milliseconds.`);
    return res;
  },
  minitorData: {},
  toMonitor: function(obj, name, prefix = '') {
    var funct;
    funct = obj[name];
    return obj[name] = function() {
      var args;
      args = arguments;
      return Codewave.logger.monitor((function() {
        return funct.apply(obj, args);
      }), prefix + name);
    };
  },
  monitor: function(funct, name) {
    var res, t0, t1;
    t0 = performance.now();
    res = funct();
    t1 = performance.now();
    if (Codewave.logger.minitorData[name] != null) {
      Codewave.logger.minitorData[name].count++;
      Codewave.logger.minitorData[name].total += t1 - t0;
    } else {
      Codewave.logger.minitorData[name] = {
        count: 1,
        total: t1 - t0
      };
    }
    return res;
  },
  resume: function() {
    return console.log(Codewave.logger.minitorData);
  }
};

//# sourceMappingURL=maps/logger.js.map
