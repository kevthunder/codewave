const expect = require('chai').expect

const bootstrap = require('../../lib/bootstrap')

const Logger = require('../../lib/Logger').Logger

const TextParser = require('../../lib/TextParser').TextParser

const testUtils = require('../testHelpers/testUtils')

const path = require('path')

const util = require('util')

const fs = require('fs')

const LocalFiles = require('../../lib/fileSystem/LocalFiles').LocalFiles

describe('Codewave - file namespace', function () {
  beforeEach(function () {
    Logger.enabled = false
    this.root = (0, path.resolve)('./test/tmp/')
    this.storage = new LocalFiles(this.root)
    this.editor = new TextParser()
    this.editor.fileSystem = this.storage
    this.codewave = new bootstrap.Codewave(this.editor)
  })
  afterEach(function () {
    delete this.codewave
    delete this.storage
    util.promisify(fs.unlink)(this.file).catch(() => {
      return null
    })
  })
  it('read a file', function () {
    return this.storage.writeFile('hello', 'Hello, world!').then(() => {
      testUtils.setEditorContent(this.codewave.editor, '~~file:read hello|~~')
      return this.codewave.onActivationKey()
    }).then(() => {
      return expect(this.codewave.editor.text()).to.eq('Hello, world!')
    })
  })
  it('write a file', function () {
    testUtils.setEditorContent(this.codewave.editor, '~~file:write hello Hello|~~')
    return this.codewave.onActivationKey().then(() => {
      return this.storage.readFile('hello')
    }).then(content => {
      return expect(content).to.eq('Hello')
    })
  })
})
