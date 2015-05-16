(function() {
  this.assertEditorResult = function(editor, res) {
    var pos;
    expect(editor.text()).to.eql(res.replace('|', ''));
    pos = res.indexOf('|');
    return expect(editor.getCursorPos().raw()).to.eql([pos, pos]);
  };

  this.setEditorContent = function(editor, val) {
    var pos;
    editor.text(val.replace('|', ''));
    pos = val.indexOf('|');
    return editor.setCursorPos(pos);
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

}).call(this);

//# sourceMappingURL=test_utils.js.map
