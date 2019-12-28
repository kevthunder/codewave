const bootstrap = require('../../lib/bootstrap')

const Logger = require('../../lib/Logger').Logger

const TextParser = require('../../lib/TextParser').TextParser

const testUtils = require('../testHelpers/testUtils')

describe('Codewave - string namespace', function () {
  beforeEach(function () {
    Logger.enabled = false
    this.codewave = new bootstrap.Codewave(new TextParser())
  })
  afterEach(function () {
    delete this.codewave
  })
  it('can transforms a String from underscore to camelcase', function () {
    testUtils.setEditorContent(this.codewave.editor, '~~camelize hello_world|~~')
    return this.codewave.onActivationKey().then(() => {
      return testUtils.assertEditorResult(this.codewave.editor, 'HelloWorld')
    })
  })
  it('can camelize without first letter', function () {
    testUtils.setEditorContent(this.codewave.editor, '~~camelize hello_world first:no|~~')
    return this.codewave.onActivationKey().then(() => {
      return testUtils.assertEditorResult(this.codewave.editor, 'helloWorld')
    })
  })
})
