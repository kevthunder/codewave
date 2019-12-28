'use strict'

const FileStorageEngine = require('../../lib/storageEngines/FileStorageEngine').FileStorageEngine

const expect = require('chai').expect

var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)

const path = require('path')

const promisify = require('util').promisify

const fs = require('fs')

describe('FileStorageEngine', function () {
  beforeEach(function () {
    this.file = (0, path.resolve)('./test/tmp/test.json')
    this.storage = new FileStorageEngine(this.file)
  })
  afterEach(function () {
    delete this.storage
    return promisify(fs.unlink)(this.file).catch(() => {
      return null
    })
  })
  it('can save a key val pair', function () {
    return this.storage.load('foo').then(res => {
      expect(res).to.not.exist
      return this.storage.save('foo', 'bar')
    }).then(() => {
      this.storage = new FileStorageEngine(this.file)
      return this.storage.load('foo')
    }).then(res => {
      expect(res).to.eql('bar')
      return expect(promisify(fs.stat)(this.file)).to.not.be.rejected
    })
  })
  it('can delete everything stored', function () {
    return this.storage.load('foo').then(res => {
      expect(res).to.not.exist
      return this.storage.save('foo', 'bar')
    }).then(() => {
      return this.storage.load('foo')
    }).then(res => {
      expect(res).to.eql('bar')
      return this.storage.deleteFile()
    }).then(() => {
      return this.storage.load('foo')
    }).then(res => {
      expect(res).to.not.exist
      return expect(promisify(fs.stat)(this.file)).to.be.rejectedWith('no such file or directory')
    })
  })
  it('can save in a given path', function () {
    return this.storage.load('foo').then(res => {
      expect(res).to.not.exist
      return this.storage.saveInPath('foo', 'baz', 'bar')
    }).then(() => {
      return this.storage.load('foo')
    }).then(res => {
      expect(res).to.deep.eql({
        baz: 'bar'
      })
      return this.storage.saveInPath('foo', 'foobar', 'bar')
    }).then(() => {
      return this.storage.load('foo')
    }).then(res => {
      return expect(res).to.deep.eql({
        baz: 'bar',
        foobar: 'bar'
      })
    })
  })
})
