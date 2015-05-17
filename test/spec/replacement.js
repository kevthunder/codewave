(function() {
  describe('Replacement', function() {
    beforeEach(function() {
      this.replacement = null;
      return this.editor = null;
    });
    afterEach(function() {
      delete this.replacement;
      return delete this.editor;
    });
    it('editor should be settable', function() {
      this.editor = new Codewave.TextParser('lorem Ipsum');
      this.replacement = new Codewave.util.Replacement(1, 2, 'a');
      expect(this.replacement).to.respondTo('withEditor');
      expect(this.replacement).to.respondTo('editor');
      this.replacement.withEditor(this.editor);
      return expect(this.replacement.editor()).to.eql(this.editor);
    });
    return it('should take prefix option', function() {
      this.editor = new Codewave.TextParser('lorem Ipsum');
      this.replacement = new Codewave.util.Replacement(1, 2, 'a', {
        prefix: 'test'
      }).withEditor(this.editor);
      return expect(this.replacement.prefix).to.eql('test');
    });
  });

  describe('Wrapping', function() {
    beforeEach(function() {
      this.wrapping = null;
      return this.editor = null;
    });
    afterEach(function() {
      delete this.wrapping;
      return delete this.editor;
    });
    return it('editor should be settable', function() {
      this.editor = new Codewave.TextParser('lorem Ipsum');
      this.wrapping = new Codewave.util.Wrapping(0, 5, '(', ')');
      expect(this.wrapping).to.respondTo('withEditor');
      expect(this.wrapping).to.respondTo('editor');
      this.wrapping.withEditor(this.editor);
      return expect(this.wrapping.editor()).to.eql(this.editor);
    });
  });

}).call(this);

//# sourceMappingURL=replacement.js.map
