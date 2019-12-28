'use strict'

const expect = require('chai').expect

const bootstrap = require('../../lib/bootstrap')

const Logger = require('../../lib/Logger').Logger

const TextParser = require('../../lib/TextParser').TextParser

const test_utils = require('../testHelpers/test_utils')

const StringHelper = require('../../lib/helpers/StringHelper').StringHelper

describe('Codewave - Core namespace', function () {
  beforeEach(function () {
    Logger.enabled = false
    this.codewave = new bootstrap.Codewave(new TextParser())
  })
  afterEach(function () {
    delete this.codewave
  })
  it('should create box', function () {
    test_utils.setEditorContent(this.codewave.editor, '~~box|~~ Lorem Ipsum ~~close~~ ~~/box~~')
    return this.codewave.onActivationKey().then(() => {
      return (0, test_utils.assertEditorResult)(this.codewave.editor, '<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->\n<!-- ~   Lorem Ipsum ~~close~~   ~ -->\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->|')
    })
  })
  it(' boxes should use different comment style', function () {
    this.codewave.editor.setLang('js');
    (0, test_utils.setEditorContent)(this.codewave.editor, '~~box|~~ Lorem Ipsum ~~close~~ ~~/box~~')
    return this.codewave.onActivationKey().then(() => {
      return (0, test_utils.assertEditorResult)(this.codewave.editor, '/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */\n/* ~   Lorem Ipsum ~~close~~   ~ */\n/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */|')
    })
  })
  it('should close box', function () {
    this.codewave.editor.setLang('html');
    (0, test_utils.setEditorContent)(this.codewave.editor, '<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->\n<!-- ~   Lorem Ipsum ~~close|~~   ~ -->\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->')
    return this.codewave.onActivationKey().then(() => {
      return (0, test_utils.assertEditorResult)(this.codewave.editor, '|')
    })
  })
  it('should create nested box', function () {
    this.codewave.editor.setLang('html');
    (0, test_utils.setEditorContent)(this.codewave.editor, '<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->\n<!-- ~  Lorem ipsum dolor                     ~ -->\n<!-- ~  ~~box|~~                               ~ -->\n<!-- ~  sit amet, consectetur                 ~ -->\n<!-- ~  ~~/box~~                              ~ -->\n<!-- ~  adipiscing elit.                      ~ -->\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->')
    return this.codewave.onActivationKey().then(() => {
      return (0, test_utils.assertEditorResult)(this.codewave.editor, '<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->\n<!-- ~  Lorem ipsum dolor                     ~ -->\n<!-- ~  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->  ~ -->\n<!-- ~  <!-- ~  sit amet, consectetur  ~ -->  ~ -->\n<!-- ~  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->|  ~ -->\n<!-- ~  adipiscing elit.                      ~ -->\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->')
    })
  })
  it('should close nested box', function () {
    this.codewave.editor.setLang('html');
    (0, test_utils.setEditorContent)(this.codewave.editor, '<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->\n<!-- ~  Lorem ipsum dolor                     ~ -->\n<!-- ~  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->  ~ -->\n<!-- ~  <!-- ~  sit amet, consectetur  ~ -->  ~ -->\n<!-- ~  <!-- ~  ~~close|~~              ~ -->  ~ -->\n<!-- ~  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->  ~ -->\n<!-- ~  adipiscing elit.                      ~ -->\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->')
    return this.codewave.onActivationKey().then(() => {
      return expect(this.codewave.editor.text()).to.match(RegExp('^' + StringHelper.escapeRegExp('<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->\n<!-- ~  Lorem ipsum dolor                     ~ -->\n<!-- ~  ##spaces## ~ -->\n<!-- ~  adipiscing elit.                      ~ -->\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->').replace('##spaces##', '\\s*') + '$'))
    })
  })
  it('closed nested box should be aligned', function () {
    this.codewave.editor.setLang('html');
    (0, test_utils.setEditorContent)(this.codewave.editor, '<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->\n<!-- ~  Lorem ipsum dolor                     ~ -->\n<!-- ~  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->  ~ -->\n<!-- ~  <!-- ~  sit amet, consectetur  ~ -->  ~ -->\n<!-- ~  <!-- ~  ~~close|~~              ~ -->  ~ -->\n<!-- ~  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->  ~ -->\n<!-- ~  adipiscing elit.                      ~ -->\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->')
    return this.codewave.onActivationKey().then(() => {
      var match, matchExp
      matchExp = RegExp('^' + StringHelper.escapeRegExp('<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->\n<!-- ~  Lorem ipsum dolor                     ~ -->\n<!-- ~  ##spaces##  ~ -->\n<!-- ~  adipiscing elit.                      ~ -->\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->').replace('##spaces##', '(\\s*)') + '$')
      expect(this.codewave.editor.text()).to.match(matchExp)
      match = this.codewave.editor.text().match(matchExp)
      expect(match[1]).property('length', 36)
      return (0, test_utils.assertEditorResult)(this.codewave.editor, '<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->\n<!-- ~  Lorem ipsum dolor                     ~ -->\n<!-- ~  |                                      ~ -->\n<!-- ~  adipiscing elit.                      ~ -->\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->')
    })
  })
  it('should close parent of nested box', function () {
    this.codewave.editor.setLang('html');
    (0, test_utils.setEditorContent)(this.codewave.editor, '<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->\n<!-- ~  Lorem ipsum dolor                     ~ -->\n<!-- ~  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->  ~ -->\n<!-- ~  <!-- ~  sit amet, consectetur  ~ -->  ~ -->\n<!-- ~  <!-- ~  ~~close~~              ~ -->  ~ -->\n<!-- ~  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->  ~ -->\n<!-- ~  adipiscing elit.                      ~ -->\n<!-- ~  ~~close|~~                             ~ -->\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->')
    return this.codewave.onActivationKey().then(() => {
      return (0, test_utils.assertEditorResult)(this.codewave.editor, '|')
    })
  })
  it('should be able to use emmet', function () {
    // console.log(module)
    // console.log(define)
    this.codewave.editor.setLang('html');
    (0, test_utils.setEditorContent)(this.codewave.editor, '~~ul>li|~~')
    return this.codewave.onActivationKey().then(() => {
      return (0, test_utils.assertEditorResult)(this.codewave.editor, '<ul>\n  <li>|</li>\n</ul>')
    })
  })
  it('should display help', function () {
    this.codewave.editor.setLang('html');
    (0, test_utils.setEditorContent)(this.codewave.editor, '~~help|~~')
    return this.codewave.onActivationKey().then(() => {
      expect(this.codewave.editor.text()).to.contain('~~~~~~~~~~')
      expect(this.codewave.editor.text()).to.contain('Codewave')
      expect(this.codewave.editor.text()).to.contain('/ /__/ _ \\/ _` / -_\\ \\/\\/ / _` \\ V / -_/') // slice from the ascii logo

      return expect(this.codewave.editor.text()).to.contain('~~close~~')
    })
  })
  it('help demo should expend editing intro', function () {
    this.codewave.editor.setLang('html');
    (0, test_utils.setEditorContent)(this.codewave.editor, '~~help:demo|~~')
    return this.codewave.onActivationKey().then(() => {
      expect(this.codewave.editor.text()).to.contain('~~~~~~~~~~')
      expect(this.codewave.editor.text()).to.contain('~~close~~')
      expect(this.codewave.editor.text()).to.not.contain('~~help:editing:intro~~')
      return expect(this.codewave.editor.text()).to.contain('Codewave allows you to make your own commands')
    })
  })
  it('can get help for the edit command', function () {
    (0, test_utils.setEditorContent)(this.codewave.editor, '~~help edit|~~')
    return this.codewave.onActivationKey().then(() => {
      expect(this.codewave.editor.text()).to.contain('~~close~~')
      return expect(this.codewave.editor.text()).to.contain('Allows to edit a command')
    })
  })
  it('can list all available commands', function () {
    (0, test_utils.setEditorContent)(this.codewave.editor, '~~ls|~~')
    return this.codewave.onActivationKey().then(() => {
      expect(this.codewave.editor.text()).to.contain('~~hello~~')
      expect(this.codewave.editor.text()).to.contain('~~ls core~~')
      expect(this.codewave.editor.text()).to.contain('~~core:help~~')
      return expect(this.codewave.editor.text()).to.contain('~~close~~')
    })
  })
  it('can list commands avaiable in a namespace', function () {
    (0, test_utils.setEditorContent)(this.codewave.editor, '~~ls help|~~')
    return this.codewave.onActivationKey().then(() => {
      expect(this.codewave.editor.text()).to.contain('~~core:help:overview~~')
      return expect(this.codewave.editor.text()).to.contain('~~close~~')
    })
  })
  it('can set a variable', function () {
    (0, test_utils.setEditorContent)(this.codewave.editor, '~~set test hello|~~')
    return this.codewave.onActivationKey().then(() => {
      expect(this.codewave.vars).to.have.property('test')
      return expect(this.codewave.vars.test).to.eq('hello')
    })
  })
  it('can set a variable from content', function () {
    (0, test_utils.setEditorContent)(this.codewave.editor, '~~set test|~~hello~~/set~~')
    return this.codewave.onActivationKey().then(() => {
      expect(this.codewave.vars).to.have.property('test')
      return expect(this.codewave.vars.test).to.eq('hello')
    })
  })
  it('can set a variable with path', function () {
    (0, test_utils.setEditorContent)(this.codewave.editor, '~~set test.test hello|~~')
    return this.codewave.onActivationKey().then(() => {
      expect(this.codewave.vars).to.have.property('test')
      return expect(this.codewave.vars.test).to.deep.eq({
        test: 'hello'
      })
    })
  })
  it('can get a variable', function () {
    this.codewave.vars.test = 'hello';
    (0, test_utils.setEditorContent)(this.codewave.editor, '~~get test|~~')
    return this.codewave.onActivationKey().then(() => {
      return expect(this.codewave.editor.text()).to.eq('hello')
    })
  })
  it('can get a variable with path', function () {
    this.codewave.vars.test = {
      test: 'hello'
    };
    (0, test_utils.setEditorContent)(this.codewave.editor, '~~get test.test|~~')
    return this.codewave.onActivationKey().then(() => {
      return expect(this.codewave.editor.text()).to.eq('hello')
    })
  })
  it('can get object variable as json', function () {
    var data
    data = {
      test: 'hello'
    }
    this.codewave.vars.test = data;
    (0, test_utils.setEditorContent)(this.codewave.editor, '~~get test|~~')
    return this.codewave.onActivationKey().then(() => {
      return expect(this.codewave.editor.text()).to.eq(JSON.stringify(data, null, '  '))
    })
  })
  it('can store json in a variable', function () {
    var json
    json = {
      test: 'hello'
    };
    (0, test_utils.setEditorContent)(this.codewave.editor, `~~store_json test|~~${JSON.stringify(json)}~~/store_json~~`)
    return this.codewave.onActivationKey().then(() => {
      expect(this.codewave.vars).to.have.property('test')
      return expect(this.codewave.vars.test).to.deep.eq(json)
    })
  })
  it('can render a template', function () {
    var data
    data = {
      name: 'world'
    }
    this.codewave.vars.test = data;
    (0, test_utils.setEditorContent)(this.codewave.editor, '~~template test|~~Hello, ~~get name~~!~~/template~~')
    return this.codewave.onActivationKey().then(() => {
      return expect(this.codewave.editor.text()).to.eq('Hello, world!')
    })
  })
  it('can render a template for an array', function () {
    var data
    data = ['world', 'CodeWave']
    this.codewave.vars.test = data
    this.codewave.editor.setLang('html');
    (0, test_utils.setEditorContent)(this.codewave.editor, '~~template test|~~Hello, ~~get value~~!~~/template~~')
    return this.codewave.onActivationKey().then(() => {
      return expect(this.codewave.editor.text()).to.eq('Hello, world!\nHello, CodeWave!')
    })
  })
})
