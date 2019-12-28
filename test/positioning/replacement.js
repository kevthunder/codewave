'use strict'

const expect = require('chai').expect

const TextParser = require('../../lib/TextParser').TextParser

const Replacement = require('../../lib/positioning/Replacement').Replacement

describe('Replacement', function () {
  beforeEach(function () {
    this.replacement = null
    return this.editor = null
  })
  afterEach(function () {
    delete this.replacement
    return delete this.editor
  })
  it('editor should be settable', function () {
    this.editor = new TextParser('lorem Ipsum')
    this.replacement = new Replacement(1, 2, 'a')
    expect(this.replacement).to.respondTo('withEditor')
    expect(this.replacement).to.respondTo('editor')
    this.replacement.withEditor(this.editor)
    return expect(this.replacement.editor()).to.eql(this.editor)
  })
  it('should take prefix option', function () {
    this.editor = new TextParser('lorem Ipsum')
    this.replacement = new Replacement(1, 2, 'a', {
      prefix: 'test'
    }).withEditor(this.editor)
    return expect(this.replacement.prefix).to.eql('test')
  })
})
