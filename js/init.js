// Generated by CoffeeScript 1.8.0
(function() {
  var data, fullname, saved;

  saved = Codewave.storage.load('saved');

  if (saved != null) {
    for (fullname in saved) {
      data = saved[fullname];
      Codewave.setCmd(fullname, data, false);
    }
  }

}).call(this);

//# sourceMappingURL=init.js.map
