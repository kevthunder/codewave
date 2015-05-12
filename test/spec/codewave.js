(function() {
  describe('Codewave', function() {
    beforeEach(function() {
      return this.codewave = Codewave.detect('Editor');
    });
    afterEach(function() {
      return delete this.codewave;
    });
    it('should use tilde brakets', function() {
      return expect(this.codewave).property('brakets', '~~');
    });
    it('should create brakets', function() {
      setEditorContent(this.codewave.editor, 'lo|rem');
      this.codewave.onActivationKey();
      return assertEditorResult(this.codewave.editor, 'lo~~|~~rem');
    });
    it('should create brakets at begining', function() {
      setEditorContent(this.codewave.editor, '|lorem');
      this.codewave.onActivationKey();
      return assertEditorResult(this.codewave.editor, '~~|~~lorem');
    });
    it('should create brakets at end', function() {
      setEditorContent(this.codewave.editor, 'lorem|');
      this.codewave.onActivationKey();
      return assertEditorResult(this.codewave.editor, 'lorem~~|~~');
    });
    it('should reduce brakets', function() {
      setEditorContent(this.codewave.editor, 'lorem~~|~~ipsum');
      this.codewave.onActivationKey();
      return assertEditorResult(this.codewave.editor, 'lorem|ipsum');
    });
    it('should reduce brakets at begining', function() {
      setEditorContent(this.codewave.editor, '~~|~~lorem');
      this.codewave.onActivationKey();
      return assertEditorResult(this.codewave.editor, '|lorem');
    });
    it('should expand hello', function() {
      setEditorContent(this.codewave.editor, '- ~~|hello~~');
      this.codewave.onActivationKey();
      return assertEditorResult(this.codewave.editor, '- Hello, World!|');
    });
    it('should expand hello (cursor middle)', function() {
      setEditorContent(this.codewave.editor, '- ~~hel|lo~~');
      this.codewave.onActivationKey();
      return assertEditorResult(this.codewave.editor, '- Hello, World!|');
    });
    it('should expand hello (cursor end)', function() {
      setEditorContent(this.codewave.editor, '- ~~hello|~~');
      this.codewave.onActivationKey();
      return assertEditorResult(this.codewave.editor, '- Hello, World!|');
    });
    it('should expand hello (cursor middle end bracket)', function() {
      setEditorContent(this.codewave.editor, '- ~~hello~|~');
      this.codewave.onActivationKey();
      return assertEditorResult(this.codewave.editor, '- Hello, World!|');
    });
    it('should expand hello (cursor after)', function() {
      setEditorContent(this.codewave.editor, '- ~~hello~~|');
      this.codewave.onActivationKey();
      return assertEditorResult(this.codewave.editor, '- Hello, World!|');
    });
    it('should expand hello at begining', function() {
      setEditorContent(this.codewave.editor, '~~|hello~~');
      this.codewave.onActivationKey();
      return assertEditorResult(this.codewave.editor, 'Hello, World!|');
    });
    it('should expand on closing tag', function() {
      setEditorContent(this.codewave.editor, '- ~~hello~~ ~~/hello|~~');
      this.codewave.onActivationKey();
      return assertEditorResult(this.codewave.editor, '- Hello, World!|');
    });
    it('should create box', function() {
      setEditorContent(this.codewave.editor, '~~box|~~ Lorem Ipsum ~~close~~ ~~/box~~');
      this.codewave.onActivationKey();
      return assertEditorResult(this.codewave.editor, "<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->\n<!-- ~   Lorem Ipsum ~~close~~   ~ -->\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->|");
    });
    it(' boxes should use different comment style', function() {
      this.codewave.editor.setLang('js');
      setEditorContent(this.codewave.editor, '~~box|~~ Lorem Ipsum ~~close~~ ~~/box~~');
      this.codewave.onActivationKey();
      return assertEditorResult(this.codewave.editor, "/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */\n/* ~   Lorem Ipsum ~~close~~   ~ */\n/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */|");
    });
    it('should close box', function() {
      this.codewave.editor.setLang('html');
      setEditorContent(this.codewave.editor, "<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->\n<!-- ~   Lorem Ipsum ~~close|~~   ~ -->\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->");
      this.codewave.onActivationKey();
      return assertEditorResult(this.codewave.editor, '|');
    });
    it('should create nested box', function() {
      this.codewave.editor.setLang('html');
      setEditorContent(this.codewave.editor, "<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->\n<!-- ~  Lorem ipsum dolor                     ~ -->\n<!-- ~  ~~box|~~                               ~ -->\n<!-- ~  sit amet, consectetur                 ~ -->\n<!-- ~  ~~/box~~                              ~ -->\n<!-- ~  adipiscing elit.                      ~ -->\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->");
      this.codewave.onActivationKey();
      return assertEditorResult(this.codewave.editor, "<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->\n<!-- ~  Lorem ipsum dolor                     ~ -->\n<!-- ~  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->  ~ -->\n<!-- ~  <!-- ~  sit amet, consectetur  ~ -->  ~ -->\n<!-- ~  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->|  ~ -->\n<!-- ~  adipiscing elit.                      ~ -->\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->");
    });
    it('should close nested box', function() {
      this.codewave.editor.setLang('html');
      setEditorContent(this.codewave.editor, "<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->\n<!-- ~  Lorem ipsum dolor                     ~ -->\n<!-- ~  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->  ~ -->\n<!-- ~  <!-- ~  sit amet, consectetur  ~ -->  ~ -->\n<!-- ~  <!-- ~  ~~close|~~              ~ -->  ~ -->\n<!-- ~  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->  ~ -->\n<!-- ~  adipiscing elit.                      ~ -->\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->");
      this.codewave.onActivationKey();
      return assertEditorResult(this.codewave.editor, "<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->\n<!-- ~  Lorem ipsum dolor                     ~ -->\n<!-- ~  |                                      ~ -->\n<!-- ~  adipiscing elit.                      ~ -->\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->");
    });
    it('should close parent of nested box', function() {
      this.codewave.editor.setLang('html');
      setEditorContent(this.codewave.editor, "<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->\n<!-- ~  Lorem ipsum dolor                     ~ -->\n<!-- ~  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->  ~ -->\n<!-- ~  <!-- ~  sit amet, consectetur  ~ -->  ~ -->\n<!-- ~  <!-- ~  ~~close~~              ~ -->  ~ -->\n<!-- ~  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->  ~ -->\n<!-- ~  adipiscing elit.                      ~ -->\n<!-- ~  ~~close|~~                             ~ -->\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->");
      this.codewave.onActivationKey();
      return assertEditorResult(this.codewave.editor, '|');
    });
    it('should follow alias with name wildcard', function() {
      this.codewave.editor.setLang('html');
      setEditorContent(this.codewave.editor, '~~php:outer:f|~~');
      this.codewave.onActivationKey();
      return assertEditorResult(this.codewave.editor, "<?php\n  function |() {\n    \n  }\n?>");
    });
    return it('should be able to use emmet', function() {
      this.codewave.editor.setLang('html');
      setEditorContent(this.codewave.editor, '~~ul>li|~~');
      this.codewave.onActivationKey();
      return assertEditorResult(this.codewave.editor, "<ul>\n  <li>|</li>\n</ul>");
    });
  });

}).call(this);

//# sourceMappingURL=codewave.js.map
