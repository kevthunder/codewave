(function() {
  describe('Codewave for PHP', function() {
    beforeEach(function() {
      createTextArea('Editor');
      Codewave.logger.enabled = false;
      return this.codewave = Codewave.detect('Editor');
    });
    afterEach(function() {
      delete this.codewave;
      return removeTextArea('Editor');
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
    it('should add no inner php tags to functions', function() {
      this.codewave.editor.setLang('php');
      setEditorContent(this.codewave.editor, '~~f|~~');
      this.codewave.onActivationKey();
      return assertEditorResult(this.codewave.editor, "<?php\n  function |() {\n    \n  }\n?>");
    });
    it(' should add php tag to boxes', function() {
      this.codewave.editor.setLang('php');
      setEditorContent(this.codewave.editor, '~~box|~~ Lorem Ipsum ~~close~~ ~~/box~~');
      this.codewave.onActivationKey();
      return assertEditorResult(this.codewave.editor, "<?php\n/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */\n/* ~   Lorem Ipsum ~~close~~   ~ */\n/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */\n?>|");
    });
    return it('should remove php tag when closing box', function() {
      this.codewave.editor.setLang('php');
      setEditorContent(this.codewave.editor, "<?php\n/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */\n/* ~   Lorem Ipsum ~~close|~~   ~ */\n/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */\n?>");
      this.codewave.onActivationKey();
      return assertEditorResult(this.codewave.editor, '|');
    });
  });

}).call(this);

//# sourceMappingURL=php.js.map
