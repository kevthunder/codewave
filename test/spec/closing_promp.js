(function() {
  describe('ClosingPromp', function() {
    beforeEach(function() {
      createTextArea('Editor');
      Codewave.logger.enabled = false;
      return this.codewave = new Codewave(new Codewave.TestEditor('Editor'));
    });
    afterEach(function() {
      delete this.codewave;
      return removeTextArea('Editor');
    });
    it('should add listener', function() {
      expect(this.codewave.editor.changeListeners).property('length', 0);
      setEditorContent(this.codewave.editor, '|[lorem ipsum]');
      this.codewave.onActivationKey();
      return expect(this.codewave.editor.changeListeners).property('length', 1);
    });
    it('should create ref in Codewave obj', function() {
      expect(this.codewave.editor.changeListeners).property('length', 0);
      setEditorContent(this.codewave.editor, '|[lorem ipsum]');
      this.codewave.onActivationKey();
      return expect(this.codewave.closingPromp).to.exist;
    });
    it('should remove ref when stopping', function() {
      expect(this.codewave.editor.changeListeners).property('length', 0);
      setEditorContent(this.codewave.editor, '|[lorem ipsum]');
      this.codewave.onActivationKey();
      expect(this.codewave.closingPromp).to.exist;
      this.codewave.closingPromp.stop();
      return expect(this.codewave.closingPromp).to.not.exist;
    });
    it('should remove listener when stopping', function() {
      expect(this.codewave.editor.changeListeners).property('length', 0);
      setEditorContent(this.codewave.editor, '|[lorem ipsum]');
      this.codewave.onActivationKey();
      expect(this.codewave.editor.changeListeners).property('length', 1);
      this.codewave.closingPromp.stop();
      return expect(this.codewave.editor.changeListeners).property('length', 0);
    });
    it('should create 2 selections', function() {
      setEditorContent(this.codewave.editor, '|[lorem ipsum]');
      this.codewave.onActivationKey();
      return assertEditorResult(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~');
    });
    it('should revert when empty', function() {
      setEditorContent(this.codewave.editor, '|[lorem ipsum]');
      this.codewave.onActivationKey();
      assertEditorResult(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~');
      this.codewave.onActivationKey();
      return assertEditorResult(this.codewave.editor, '|[lorem ipsum]');
    });
    it('ref should stay the same', function() {
      var closingPromp;
      setEditorContent(this.codewave.editor, '|[lorem ipsum]');
      this.codewave.onActivationKey();
      closingPromp = this.codewave.closingPromp;
      expect(closingPromp).property('nbChanges', 0);
      assertEditorResult(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~');
      setEditorContent(this.codewave.editor, '~~e|~~\nlorem ipsum\n~~/e|~~');
      this.codewave.editor.onAnyChange();
      return expect(this.codewave.closingPromp).to.eql(closingPromp);
    });
    it('should react to change', function() {
      var closingPromp;
      setEditorContent(this.codewave.editor, '|[lorem ipsum]');
      this.codewave.onActivationKey();
      closingPromp = this.codewave.closingPromp;
      expect(closingPromp).property('nbChanges', 0);
      assertEditorResult(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~');
      setEditorContent(this.codewave.editor, '~~e|~~\nlorem ipsum\n~~/e|~~');
      this.codewave.editor.onAnyChange();
      return expect(closingPromp).property('nbChanges', 1);
    });
    it('should keep going after one letter', function() {
      var closingPromp;
      setEditorContent(this.codewave.editor, '|[lorem ipsum]');
      this.codewave.onActivationKey();
      closingPromp = this.codewave.closingPromp;
      assertEditorResult(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~');
      setEditorContent(this.codewave.editor, '~~e|~~\nlorem ipsum\n~~/e|~~');
      this.codewave.editor.onAnyChange();
      return expect(closingPromp).to.exist;
    });
    it('should detect typed text', function() {
      var closingPromp;
      setEditorContent(this.codewave.editor, '|[lorem ipsum]');
      this.codewave.onActivationKey();
      closingPromp = this.codewave.closingPromp;
      assertEditorResult(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~');
      setEditorContent(this.codewave.editor, '~~test|~~\nlorem ipsum\n~~/test|~~');
      this.codewave.editor.onAnyChange();
      return expect(closingPromp.typed()).to.eql('test');
    });
    it('should stop after space', function() {
      var closingPromp;
      setEditorContent(this.codewave.editor, '|[lorem ipsum]');
      this.codewave.onActivationKey();
      closingPromp = this.codewave.closingPromp;
      assertEditorResult(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~');
      setEditorContent(this.codewave.editor, '~~test |~~\nlorem ipsum\n~~/test |~~');
      this.codewave.editor.onAnyChange();
      expect(closingPromp.shouldStop()).to.eql(true);
      return expect(closingPromp).property('started', false);
    });
    return it('should remove space after stop', function() {
      var closingPromp;
      setEditorContent(this.codewave.editor, '|[lorem ipsum]');
      this.codewave.onActivationKey();
      closingPromp = this.codewave.closingPromp;
      assertEditorResult(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~');
      setEditorContent(this.codewave.editor, '~~test |~~\nlorem ipsum\n~~/test |~~');
      this.codewave.editor.onAnyChange();
      expect(closingPromp).property('started', false);
      return assertEditorResult(this.codewave.editor, '~~test |~~\nlorem ipsum\n~~/test~~');
    });
  });

  describe('SimulatedClosingPromp', function() {
    beforeEach(function() {
      createTextArea('Editor');
      Codewave.logger.enabled = false;
      return this.codewave = Codewave.detect('Editor');
    });
    afterEach(function() {
      delete this.codewave;
      return removeTextArea('Editor');
    });
    it('should react to change', function(done) {
      var closingPromp;
      setEditorContent(this.codewave.editor, '|[lorem ipsum]');
      this.codewave.onActivationKey();
      closingPromp = this.codewave.closingPromp;
      expect(closingPromp).property('nbChanges', 0);
      assertEditorResult(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~');
      setEditorContent(this.codewave.editor, '~~e|~~\nlorem ipsum\n~~/~~');
      this.codewave.editor.onSkipedChange = (function(_this) {
        return function() {
          _this.codewave.editor.onAnyChange();
          expect(closingPromp).property('nbChanges', 1);
          return done();
        };
      })(this);
      return this.codewave.editor.onAnyChange();
    });
    it('should replicate changes', function(done) {
      var closingPromp;
      setEditorContent(this.codewave.editor, '|[lorem ipsum]');
      this.codewave.onActivationKey();
      closingPromp = this.codewave.closingPromp;
      assertEditorResult(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~');
      setEditorContent(this.codewave.editor, '~~test|~~\nlorem ipsum\n~~/~~');
      this.codewave.editor.onSkipedChange = (function(_this) {
        return function() {
          return _this.codewave.editor.onAnyChange();
        };
      })(this);
      closingPromp.onTypeSimulated = (function(_this) {
        return function() {
          assertEditorResult(_this.codewave.editor, '~~test|~~\nlorem ipsum\n~~/test~~');
          return done();
        };
      })(this);
      return this.codewave.editor.onAnyChange();
    });
    return it('should stop after space', function() {
      var closingPromp;
      setEditorContent(this.codewave.editor, '|[lorem ipsum]');
      this.codewave.onActivationKey();
      closingPromp = this.codewave.closingPromp;
      assertEditorResult(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~');
      setEditorContent(this.codewave.editor, '~~test |~~\nlorem ipsum\n~~/~~');
      this.codewave.editor.onSkipedChange = (function(_this) {
        return function() {
          return _this.codewave.editor.onAnyChange();
        };
      })(this);
      closingPromp.onTypeSimulated = (function(_this) {
        return function() {
          assertEditorResult(_this.codewave.editor, '~~test |~~\nlorem ipsum\n~~/test~~');
          expect(closingPromp).property('started', false);
          return done();
        };
      })(this);
      return this.codewave.editor.onAnyChange();
    });
  });

}).call(this);

//# sourceMappingURL=closing_promp.js.map
