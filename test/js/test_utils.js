(function() {
  var initCmds;

  this.assertEditorResult = function(editor, res) {
    var realText, ref, sels;
    ref = extractSelections(res), realText = ref[0], sels = ref[1];
    expect(editor.text()).to.eql(realText);
    if (sels.length) {
      if (editor.allowMultiSelection()) {
        return expect(editor.getMultiSel().map(function(s) {
          return s.raw();
        })).to.eql(sels.map(function(s) {
          return s.raw();
        }));
      } else {
        return expect(editor.getCursorPos().raw()).to.eql(sels[0].raw());
      }
    }
  };

  this.setEditorContent = function(editor, val) {
    var realText, ref, sels;
    ref = extractSelections(val), realText = ref[0], sels = ref[1];
    if (sels.length) {
      if (editor.allowMultiSelection()) {
        editor.setMultiSel(sels);
      } else {
        editor.setCursorPos(sels[0].start, sels[0].end);
      }
    }
    return editor.text(realText);
  };

  this.extractSelections = function(text) {
    var finalText, match, pos, sels;
    sels = [];
    finalText = text;
    while (true) {
      if (match = finalText.match(/\|\[(.*)\]/)) {
        sels.push(new Codewave.util.Pos(match.index, match.index + match[1].length));
        finalText = finalText.replace(/\|\[(.*)\]/, '$1');
      } else if ((pos = finalText.indexOf('|')) > -1) {
        sels.push(new Codewave.util.Pos(pos));
        finalText = finalText.replace('|', '');
      } else {
        break;
      }
    }
    return [finalText, sels];
  };

  if (Function.prototype.bind == null) {
    Function.prototype.bind = function(thisp) {
      return (function(_this) {
        return function() {
          return _this.apply(thisp, arguments);
        };
      })(this);
    };
  }

  this.createTextArea = function(id) {
    var area;
    area = document.createElement('textarea');
    area.id = id;
    return document.body.appendChild(area);
  };

  this.removeTextArea = function(id) {
    var area;
    area = document.getElementById(id);
    return area.parentElement.removeChild(area);
  };

  initCmds = function() {
    var test;
    test = Codewave.Command.cmds.addCmd(new Codewave.Command('test'));
    return test.addCmds({
      'replace_box': {
        'replaceBox': true,
        'result': '~~box~~Lorem ipsum~~/box~~'
      }
    });
  };

  Codewave.Command.cmdInitialisers.push(initCmds);

}).call(this);

//# sourceMappingURL=test_utils.js.map
