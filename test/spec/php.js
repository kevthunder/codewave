(function() {
  describe('Codewave for PHP', function() {
    beforeEach(function() {
      return this.codewave = Codewave.detect('Editor');
    });
    afterEach(function() {
      return delete this.codewave;
    });
    it('should create php tag', function() {
      this.codewave.editor.setLang('php');
      setEditorContent(this.codewave.editor, "~~php|~~");
      this.codewave.onActivationKey();
      return assertEditorResult(this.codewave.editor, "<?php\n  |\n?>");
    });
    it('should expand if', function() {
      this.codewave.editor.setLang('php');
      setEditorContent(this.codewave.editor, "<?php \n~~if|~~\n?>");
      this.codewave.onActivationKey();
      return assertEditorResult(this.codewave.editor, "<?php \nif(|){\n  \n}\n?>");
    });
    it('should add php tags to executable code', function() {
      this.codewave.editor.setLang('php');
      setEditorContent(this.codewave.editor, '~~if|~~');
      this.codewave.onActivationKey();
      return assertEditorResult(this.codewave.editor, "<?php if(|){ ?>\n  \n  \n  \n<?php } ?>");
    });
    return it('should add no inner php tags to functions', function() {
      this.codewave.editor.setLang('php');
      setEditorContent(this.codewave.editor, '~~f|~~');
      this.codewave.onActivationKey();
      return assertEditorResult(this.codewave.editor, "<?php\n  function |() {\n    \n  }\n?>");
    });
  });

}).call(this);

//# sourceMappingURL=php.js.map
