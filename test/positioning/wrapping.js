'use strict'

const expect = require('chai').expect

const TextParser = require('../../lib/TextParser').TextParser

const Wrapping = require('../../lib/positioning/Wrapping').Wrapping

describe('Wrapping', function () {
  beforeEach(function () {
    this.wrapping = null
    this.editor = null
  })
  afterEach(function () {
    delete this.wrapping
    delete this.editor
  })
  it('editor should be settable', function () {
    this.editor = new TextParser('lorem Ipsum')
    this.wrapping = new Wrapping(0, 5, '(', ')')
    expect(this.wrapping).to.respondTo('withEditor')
    expect(this.wrapping).to.respondTo('editor')
    this.wrapping.withEditor(this.editor)
    return expect(this.wrapping.editor()).to.eql(this.editor)
  })
})
