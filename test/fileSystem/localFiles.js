'use strict'

const LocalFiles = require('../../lib/fileSystem/LocalFiles').LocalFiles

const chai = require('chai')

const path = require('path')

const util = require('util')

const fs = require('fs')

let storage

describe('LocalFiles', function () {
  beforeEach(function () {
    this.root = (0, path.resolve)('./test/tmp/')
    storage = new LocalFiles(this.root)
  })
  afterEach(function () {
    util.promisify(fs.unlink)(this.file).catch(() => {
      return null
    })
  })
  it('does not allow to use a path ousite the root folder', function () {
    chai.expect(storage.realpath('../')).to.eq(this.root + path.sep)
  })
})
