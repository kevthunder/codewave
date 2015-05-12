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

}).call(this);

//# sourceMappingURL=test_utils.js.map
