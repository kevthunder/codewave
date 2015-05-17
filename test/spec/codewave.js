(function() {
  describe('Codewave', function() {
    beforeEach(function() {
      createTextArea('Editor');
      Codewave.logger.enabled = false;
      return this.codewave = Codewave.detect('Editor');
    });
    afterEach(function() {
      delete this.codewave;
      return removeTextArea('Editor');
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
    it('should wrap selection with brakets', function() {
      setEditorContent(this.codewave.editor, '|[lorem ipsum]');
      this.codewave.onActivationKey();
      return assertEditorResult(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/~~');
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
    it('non exiting commands should not change', function() {
      setEditorContent(this.codewave.editor, '- ~~non_exiting_command|~~');
      this.codewave.onActivationKey();
      return assertEditorResult(this.codewave.editor, '- ~~non_exiting_command|~~');
    });
    it('escaped commands should unescape', function() {
      setEditorContent(this.codewave.editor, '~~!hello|~~');
      this.codewave.onActivationKey();
      return assertEditorResult(this.codewave.editor, '~~hello~~|');
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
      return expect(this.codewave.editor.text()).to.match(RegExp('^' + Codewave.util.escapeRegExp("<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->\n<!-- ~  Lorem ipsum dolor                     ~ -->\n<!-- ~  ##spaces## ~ -->\n<!-- ~  adipiscing elit.                      ~ -->\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->").replace('##spaces##', '\\s*') + '$'));
    });
    it('closed nested box should be aligned', function() {
      var match, matchExp;
      this.codewave.editor.setLang('html');
      setEditorContent(this.codewave.editor, "<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->\n<!-- ~  Lorem ipsum dolor                     ~ -->\n<!-- ~  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->  ~ -->\n<!-- ~  <!-- ~  sit amet, consectetur  ~ -->  ~ -->\n<!-- ~  <!-- ~  ~~close|~~              ~ -->  ~ -->\n<!-- ~  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->  ~ -->\n<!-- ~  adipiscing elit.                      ~ -->\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->");
      this.codewave.onActivationKey();
      matchExp = RegExp('^' + Codewave.util.escapeRegExp("<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->\n<!-- ~  Lorem ipsum dolor                     ~ -->\n<!-- ~  ##spaces##  ~ -->\n<!-- ~  adipiscing elit.                      ~ -->\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->").replace('##spaces##', '(\\s*)') + '$');
      expect(this.codewave.editor.text()).to.match(matchExp);
      match = this.codewave.editor.text().match(matchExp);
      expect(match[1]).property('length', 36);
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
    it('should replace box on option replaceBox', function() {
      this.codewave.editor.setLang('js');
      setEditorContent(this.codewave.editor, "/* ~~~~~~~~~~~~~~~~~~~~~~~~~~ */\n/* ~  ~~test:replace_box|~~  ~ */\n/* ~~~~~~~~~~~~~~~~~~~~~~~~~~ */");
      this.codewave.onActivationKey();
      return assertEditorResult(this.codewave.editor, "/* ~~~~~~~~~~~~~~~~~ */\n/* ~  Lorem ipsum  ~ */\n/* ~~~~~~~~~~~~~~~~~ */|");
    });
    it('should be able to use emmet', function() {
      this.codewave.editor.setLang('html');
      setEditorContent(this.codewave.editor, '~~ul>li|~~');
      this.codewave.onActivationKey();
      return assertEditorResult(this.codewave.editor, "<ul>\n  <li>|</li>\n</ul>");
    });
    it('should display help', function() {
      this.codewave.editor.setLang('html');
      setEditorContent(this.codewave.editor, "~~help|~~");
      this.codewave.onActivationKey();
      expect(this.codewave.editor.text()).to.contain('~~~~~~~~~~');
      expect(this.codewave.editor.text()).to.contain('Codewave');
      expect(this.codewave.editor.text()).to.contain('/ /__/ _ \\/ _` / -_\\ \\/\\/ / _` \\ V / -_/');
      return expect(this.codewave.editor.text()).to.contain('~~close~~');
    });
    return it(' help demo should expend editing intro', function() {
      this.codewave.editor.setLang('html');
      setEditorContent(this.codewave.editor, "~~help:demo|~~");
      this.codewave.onActivationKey();
      expect(this.codewave.editor.text()).to.contain('~~~~~~~~~~');
      expect(this.codewave.editor.text()).to.contain('~~close~~');
      expect(this.codewave.editor.text()).to.not.contain('~~help:editing:intro~~');
      return expect(this.codewave.editor.text()).to.contain('Codewave allows you to make your own commands');
    });
  });

}).call(this);

//# sourceMappingURL=codewave.js.map
