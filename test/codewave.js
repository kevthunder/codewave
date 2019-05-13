"use strict";

var _chai = require("chai");

var _bootstrap = require("../lib/bootstrap");

var _Logger = require("../lib/Logger");

var _TextParser = require("../lib/TextParser");

var _test_utils = require("./testHelpers/test_utils");

var _StringHelper = require("../lib/helpers/StringHelper");

// [pawa]
//   replace /it 'should (.*)', ->/ 'def test_${slug}(self):' alter:$1,slug,/[\s()]/,'_' 
//   replace /it '(.*)', ->/ 'def test_${slug}(self):' alter:$1,slug,/[\s()]/,'_' 
//   replace /setEditorContent @(.*)$/ 'test_helper.setEditorContent(self.$1)'
//   replace /assertEditorResult @(.*)$/ 'test_helper.assertEditorResult(self,self.$1)'
//   replace /expect\((.*)\).property\('([^']*)',(.*)\)$/ 'self.assertEqual($1.$2,$3)'
//   replace /expect\((.*)\).to.contain\((.*)\)/ 'self.assertIn($2, $1)'
//   replace /expect\((.*)\).to.eql\((.*)\)/ 'self.assertEqual($1, $2)'
//   replace /expect\((.*)\).to.exist/ 'self.assertIsNotNone($1)'
//   replace /expect\((.*)\).to.not.exist/ 'self.assertIsNone($1)'
describe('Codewave', function () {
  beforeEach(function () {
    _Logger.Logger.enabled = false;
    return this.codewave = new _bootstrap.Codewave(new _TextParser.TextParser());
  });
  afterEach(function () {
    return delete this.codewave;
  });
  it('should use tilde brakets', function () {
    return (0, _chai.expect)(this.codewave).property('brakets', '~~');
  });
  it('should create brakets', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, 'lo|rem');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, 'lo~~|~~rem');
    });
  });
  it('should create brakets at begining', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, '|lorem');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, '~~|~~lorem');
    });
  });
  it('should wrap selection with brakets', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, '|[lorem ipsum]');
    return this.codewave.onActivationKey().then(() => {
      console.log('assertEditorResult', this.codewave.editor.text());
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/~~');
    });
  });
  it('should create brakets at end', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, 'lorem|');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, 'lorem~~|~~');
    });
  });
  it('should reduce brakets', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, 'lorem~~|~~ipsum');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, 'lorem|ipsum');
    });
  });
  it('should reduce brakets at begining', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, '~~|~~lorem');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, '|lorem');
    });
  });
  it('should expand hello', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, '- ~~|hello~~');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, '- Hello, World!|');
    });
  });
  it('should expand hello (cursor middle)', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, '- ~~hel|lo~~');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, '- Hello, World!|');
    });
  });
  it('should expand hello (cursor end)', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, '- ~~hello|~~');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, '- Hello, World!|');
    });
  });
  it('should expand hello (cursor middle end bracket)', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, '- ~~hello~|~');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, '- Hello, World!|');
    });
  });
  it('should expand hello (cursor after)', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, '- ~~hello~~|');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, '- Hello, World!|');
    });
  });
  it('should expand hello at begining', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, '~~|hello~~');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, 'Hello, World!|');
    });
  });
  it('should expand on closing tag', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, '- ~~hello~~ ~~/hello|~~');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, '- Hello, World!|');
    });
  });
  it('non exiting commands should not change', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, '- ~~non_exiting_command|~~');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, '- ~~non_exiting_command|~~');
    });
  });
  it('escaped commands should unescape', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, '~~!hello|~~');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, '~~hello~~|');
    });
  });
  it('should create box', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, '~~box|~~ Lorem Ipsum ~~close~~ ~~/box~~');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, "<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->\n<!-- ~   Lorem Ipsum ~~close~~   ~ -->\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->|");
    });
  });
  it(' boxes should use different comment style', function () {
    this.codewave.editor.setLang('js');
    (0, _test_utils.setEditorContent)(this.codewave.editor, '~~box|~~ Lorem Ipsum ~~close~~ ~~/box~~');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, "/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */\n/* ~   Lorem Ipsum ~~close~~   ~ */\n/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */|");
    });
  });
  it('should close box', function () {
    this.codewave.editor.setLang('html');
    (0, _test_utils.setEditorContent)(this.codewave.editor, "<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->\n<!-- ~   Lorem Ipsum ~~close|~~   ~ -->\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->");
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, '|');
    });
  });
  it('should create nested box', function () {
    this.codewave.editor.setLang('html');
    (0, _test_utils.setEditorContent)(this.codewave.editor, "<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->\n<!-- ~  Lorem ipsum dolor                     ~ -->\n<!-- ~  ~~box|~~                               ~ -->\n<!-- ~  sit amet, consectetur                 ~ -->\n<!-- ~  ~~/box~~                              ~ -->\n<!-- ~  adipiscing elit.                      ~ -->\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->");
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, "<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->\n<!-- ~  Lorem ipsum dolor                     ~ -->\n<!-- ~  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->  ~ -->\n<!-- ~  <!-- ~  sit amet, consectetur  ~ -->  ~ -->\n<!-- ~  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->|  ~ -->\n<!-- ~  adipiscing elit.                      ~ -->\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->");
    });
  });
  it('should close nested box', function () {
    this.codewave.editor.setLang('html');
    (0, _test_utils.setEditorContent)(this.codewave.editor, "<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->\n<!-- ~  Lorem ipsum dolor                     ~ -->\n<!-- ~  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->  ~ -->\n<!-- ~  <!-- ~  sit amet, consectetur  ~ -->  ~ -->\n<!-- ~  <!-- ~  ~~close|~~              ~ -->  ~ -->\n<!-- ~  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->  ~ -->\n<!-- ~  adipiscing elit.                      ~ -->\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->");
    return this.codewave.onActivationKey().then(() => {
      return (0, _chai.expect)(this.codewave.editor.text()).to.match(RegExp('^' + _StringHelper.StringHelper.escapeRegExp("<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->\n<!-- ~  Lorem ipsum dolor                     ~ -->\n<!-- ~  ##spaces## ~ -->\n<!-- ~  adipiscing elit.                      ~ -->\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->").replace('##spaces##', '\\s*') + '$'));
    });
  });
  it('closed nested box should be aligned', function () {
    this.codewave.editor.setLang('html');
    (0, _test_utils.setEditorContent)(this.codewave.editor, "<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->\n<!-- ~  Lorem ipsum dolor                     ~ -->\n<!-- ~  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->  ~ -->\n<!-- ~  <!-- ~  sit amet, consectetur  ~ -->  ~ -->\n<!-- ~  <!-- ~  ~~close|~~              ~ -->  ~ -->\n<!-- ~  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->  ~ -->\n<!-- ~  adipiscing elit.                      ~ -->\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->");
    return this.codewave.onActivationKey().then(() => {
      var match, matchExp;
      matchExp = RegExp('^' + _StringHelper.StringHelper.escapeRegExp("<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->\n<!-- ~  Lorem ipsum dolor                     ~ -->\n<!-- ~  ##spaces##  ~ -->\n<!-- ~  adipiscing elit.                      ~ -->\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->").replace('##spaces##', '(\\s*)') + '$');
      (0, _chai.expect)(this.codewave.editor.text()).to.match(matchExp);
      match = this.codewave.editor.text().match(matchExp);
      (0, _chai.expect)(match[1]).property('length', 36);
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, "<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->\n<!-- ~  Lorem ipsum dolor                     ~ -->\n<!-- ~  |                                      ~ -->\n<!-- ~  adipiscing elit.                      ~ -->\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->");
    });
  });
  it('should close parent of nested box', function () {
    this.codewave.editor.setLang('html');
    (0, _test_utils.setEditorContent)(this.codewave.editor, "<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->\n<!-- ~  Lorem ipsum dolor                     ~ -->\n<!-- ~  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->  ~ -->\n<!-- ~  <!-- ~  sit amet, consectetur  ~ -->  ~ -->\n<!-- ~  <!-- ~  ~~close~~              ~ -->  ~ -->\n<!-- ~  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->  ~ -->\n<!-- ~  adipiscing elit.                      ~ -->\n<!-- ~  ~~close|~~                             ~ -->\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->");
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, '|');
    });
  });
  it('should follow alias with name wildcard', function () {
    this.codewave.editor.setLang('html');
    (0, _test_utils.setEditorContent)(this.codewave.editor, '~~php:outer:f|~~');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, "<?php\n  function |() {\n    \n  }\n?>");
    });
  });
  it('should replace box on option replaceBox', function () {
    this.codewave.editor.setLang('js');
    (0, _test_utils.setEditorContent)(this.codewave.editor, "/* ~~~~~~~~~~~~~~~~~~~~~~~~~~ */\n/* ~  ~~test:replace_box|~~  ~ */\n/* ~~~~~~~~~~~~~~~~~~~~~~~~~~ */");
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, "/* ~~~~~~~~~~~~~~~~~ */\n/* ~  Lorem ipsum  ~ */\n/* ~~~~~~~~~~~~~~~~~ */|");
    });
  }); //  it 'should replace nested box on option replaceBox', ->
  //    @codewave.editor.setLang('js')
  //    setEditorContent @codewave.editor, 
  //      """/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  //         /* ~  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~ */  ~ */
  //         /* ~  /* ~  ~~test:replace_box|~~  ~ */  ~ */
  //         /* ~  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~ */  ~ */
  //         /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */"""
  //    @codewave.onActivationKey()
  //    assertEditorResult @codewave.editor, 
  //      """/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  //         /* ~  /* ~~~~~~~~~~~~~~~~~ */  ~ */
  //         /* ~  /* ~  Lorem ipsum  ~ */  ~ */
  //         /* ~  /* ~~~~~~~~~~~~~~~~~ */  ~ */
  //         /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */|"""

  it('should be able to use emmet', function () {
    // console.log(module)
    // console.log(define)
    this.codewave.editor.setLang('html');
    (0, _test_utils.setEditorContent)(this.codewave.editor, '~~ul>li|~~');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, "<ul>\n  <li>|</li>\n</ul>");
    });
  });
  it('should display help', function () {
    this.codewave.editor.setLang('html');
    (0, _test_utils.setEditorContent)(this.codewave.editor, "~~help|~~");
    return this.codewave.onActivationKey().then(() => {
      (0, _chai.expect)(this.codewave.editor.text()).to.contain('~~~~~~~~~~');
      (0, _chai.expect)(this.codewave.editor.text()).to.contain('Codewave');
      (0, _chai.expect)(this.codewave.editor.text()).to.contain('/ /__/ _ \\/ _` / -_\\ \\/\\/ / _` \\ V / -_/'); // slice from the ascii logo

      return (0, _chai.expect)(this.codewave.editor.text()).to.contain('~~close~~');
    });
  });
  return it(' help demo should expend editing intro', function () {
    this.codewave.editor.setLang('html');
    (0, _test_utils.setEditorContent)(this.codewave.editor, "~~help:demo|~~");
    return this.codewave.onActivationKey().then(() => {
      (0, _chai.expect)(this.codewave.editor.text()).to.contain('~~~~~~~~~~');
      (0, _chai.expect)(this.codewave.editor.text()).to.contain('~~close~~');
      (0, _chai.expect)(this.codewave.editor.text()).to.not.contain('~~help:editing:intro~~');
      return (0, _chai.expect)(this.codewave.editor.text()).to.contain('Codewave allows you to make your own commands');
    });
  });
});
//# sourceMappingURL=maps/codewave.js.map
