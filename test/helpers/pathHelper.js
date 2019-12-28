'use strict'

const PathHelper = require('../../lib/helpers/PathHelper').PathHelper

const expect = require('chai').expect

describe('PathHelper', function () {
  it('can set a value at a path', function () {
    var obj, res
    obj = {}
    res = PathHelper.setPath(obj, 'test.test', 'hello')
    return expect(obj).to.deep.eq({
      test: {
        test: 'hello'
      }
    })
  })
  it('can get a value at a path', function () {
    var obj, res
    obj = {
      test: {
        test: 'hello'
      }
    }
    res = PathHelper.getPath(obj, 'test.test')
    return expect(res).to.eq('hello')
  })
  it('can get a value at a path that does not exists', function () {
    var obj, res
    obj = {}
    res = PathHelper.getPath(obj, 'test.test')
    return expect(res).to.be.undefined
  })
})
