(function() {
  describe('Codewave', function() {
    beforeEach(function() {
      createTextArea('Editor');
      Codewave.logger.enabled = false;
      Codewave.Command.resetSaved();
      return this.codewave = Codewave.detect('Editor');
    });
    afterEach(function() {
      delete this.codewave;
      Codewave.Command.resetSaved();
      return removeTextArea('Editor');
    });
    it('should show edit box for new command', function() {
      this.codewave.editor.setLang('js');
      setEditorContent(this.codewave.editor, '~~e|dit new_cmd~~');
      this.codewave.onActivationKey();
      return assertEditorResult(this.codewave.editor, "/* ~~core:edit new_cmd~~~~~ */\n/* ~  ~~help~~            ~ */\n/* ~                      ~ */\n/* ~  ~~/help~~           ~ */\n/* ~  ~~source~~          ~ */\n/* ~  |                    ~ */\n/* ~  ~~/source~~         ~ */\n/* ~  ~~save~~ ~~close~~  ~ */\n/* ~~/core:edit~~~~~~~~~~~~ */");
    });
    it('should save new command', function() {
      expect(this.codewave.context.getCmd('new_cmd')).to.not.exist;
      this.codewave.editor.setLang('js');
      setEditorContent(this.codewave.editor, "/* ~~core:edit new_cmd~~~~~ */\n/* ~  ~~help~~            ~ */\n/* ~                      ~ */\n/* ~  ~~/help~~           ~ */\n/* ~  ~~source~~          ~ */\n/* ~  Lorem ipsum         ~ */\n/* ~  ~~/source~~         ~ */\n/* ~  ~~|save~~ ~~close~~  ~ */\n/* ~~/core:edit~~~~~~~~~~~~ */");
      this.codewave.onActivationKey();
      expect(this.codewave.context.getCmd('new_cmd')).to.exist;
      return assertEditorResult(this.codewave.editor, '|');
    });
    it('new command should expand', function() {
      this.codewave.editor.setLang('js');
      setEditorContent(this.codewave.editor, "/* ~~core:edit new_cmd~~~~~ */\n/* ~  ~~help~~            ~ */\n/* ~                      ~ */\n/* ~  ~~/help~~           ~ */\n/* ~  ~~source~~          ~ */\n/* ~  Lorem ipsum         ~ */\n/* ~  ~~/source~~         ~ */\n/* ~  ~~|save~~ ~~close~~  ~ */\n/* ~~/core:edit~~~~~~~~~~~~ */");
      this.codewave.onActivationKey();
      setEditorContent(this.codewave.editor, "~~new_cmd|~~");
      this.codewave.onActivationKey();
      return assertEditorResult(this.codewave.editor, 'Lorem ipsum|');
    });
    return it('should allow command alias', function() {
      this.codewave.editor.setLang('js');
      setEditorContent(this.codewave.editor, '~~alias hello hello2|~~');
      this.codewave.onActivationKey();
      setEditorContent(this.codewave.editor, "~~hello2|~~");
      this.codewave.onActivationKey();
      return assertEditorResult(this.codewave.editor, 'Hello, World!|');
    });
  });

}).call(this);

//# sourceMappingURL=cmd_authoring.js.map
