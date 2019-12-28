const expect = require('chai').expect

const bootstrap = require('../lib/bootstrap')

const Logger = require('../lib/Logger').Logger

const TextParser = require('../lib/TextParser').TextParser

describe('Editor', function () {
  beforeEach(function () {
    Logger.enabled = false
    this.codewave = new bootstrap.Codewave(new TextParser())
  })
  afterEach(function () {
    delete this.codewave
  })
  it('should set cursor pos', function () {
    this.codewave.editor.text('lorem')
    this.codewave.editor.setCursorPos(2)
    expect(this.codewave.editor.getCursorPos()).to.respondTo('raw')
    return expect(this.codewave.editor.getCursorPos().raw()).to.eql([2, 2])
  })
})
