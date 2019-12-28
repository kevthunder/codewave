'use strict'

const expect = require('chai').expect

const bootstrap = require('../../lib/bootstrap')

const Logger = require('../../lib/Logger').Logger

const TextParser = require('../../lib/TextParser').TextParser

const test_utils = require('../testHelpers/test_utils')

const StringHelper = require('../../lib/helpers/StringHelper').StringHelper

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
    return this.codewave = new bootstrap.Codewave(this.editor)
  })
  afterEach(function () {
    delete this.codewave
    delete this.storage
    return (0, util.promisify)(fs.unlink)(this.file).catch(() => {
      return null
    })
  })
  it('read a file', function () {
    return this.storage.writeFile('hello', 'Hello, world!').then(() => {
      (0, test_utils.setEditorContent)(this.codewave.editor, '~~file:read hello|~~')
      return this.codewave.onActivationKey()
    }).then(() => {
      return expect(this.codewave.editor.text()).to.eq('Hello, world!')
    })
  })
  it('write a file', function () {
    (0, test_utils.setEditorContent)(this.codewave.editor, '~~file:write hello Hello|~~')
    return this.codewave.onActivationKey().then(() => {
      return this.storage.readFile('hello')
    }).then(content => {
      return expect(content).to.eq('Hello')
    })
  })
})
