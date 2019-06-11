"use strict";

var _chai = require("chai");

var _bootstrap = require("../../lib/bootstrap");

var _Logger = require("../../lib/Logger");

var _TextParser = require("../../lib/TextParser");

var _test_utils = require("../testHelpers/test_utils");

var _StringHelper = require("../../lib/helpers/StringHelper");

describe('Codewave - Core namespace', function () {
  beforeEach(function () {
    _Logger.Logger.enabled = false;
    return this.codewave = new _bootstrap.Codewave(new _TextParser.TextParser());
  });
  afterEach(function () {
    return delete this.codewave;
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
  it(' help demo should expend editing intro', function () {
    this.codewave.editor.setLang('html');
    (0, _test_utils.setEditorContent)(this.codewave.editor, "~~help:demo|~~");
    return this.codewave.onActivationKey().then(() => {
      (0, _chai.expect)(this.codewave.editor.text()).to.contain('~~~~~~~~~~');
      (0, _chai.expect)(this.codewave.editor.text()).to.contain('~~close~~');
      (0, _chai.expect)(this.codewave.editor.text()).to.not.contain('~~help:editing:intro~~');
      return (0, _chai.expect)(this.codewave.editor.text()).to.contain('Codewave allows you to make your own commands');
    });
  });
  return it(' can get help for the edit command', function () {
    this.codewave.editor.setLang('html');
    (0, _test_utils.setEditorContent)(this.codewave.editor, "~~help edit|~~");
    return this.codewave.onActivationKey().then(() => {
      (0, _chai.expect)(this.codewave.editor.text()).to.contain('~~close~~');
      return (0, _chai.expect)(this.codewave.editor.text()).to.contain('Allows to edit a command');
    });
  });
});
//# sourceMappingURL=../maps/cmds/core.js.map