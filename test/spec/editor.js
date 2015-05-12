(function() {
  describe('Editor', function() {
    beforeEach(function() {
      return this.codewave = Codewave.detect('Editor');
    });
    afterEach(function() {
      return delete this.codewave;
    });
    return it('should set cursor pos', function() {
      this.codewave.editor.text('lorem');
      this.codewave.editor.setCursorPos(2);
      expect(this.codewave.editor.getCursorPos()).to.respondTo('raw');
      return expect(this.codewave.editor.getCursorPos().raw()).to.eql([2, 2]);
    });
  });

}).call(this);

//# sourceMappingURL=editor.js.map
