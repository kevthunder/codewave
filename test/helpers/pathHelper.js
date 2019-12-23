"use strict";

const PathHelper = require("../../lib/helpers/PathHelper");

const chai = require("chai");

describe('PathHelper', function () {
  it('can set a value at a path', function () {
    var obj, res;
    obj = {};
    res = PathHelper.PathHelper.setPath(obj, 'test.test', 'hello');
    return (0, chai.expect)(obj).to.deep.eq({
      test: {
        test: 'hello'
      }
    });
  });
  it('can get a value at a path', function () {
    var obj, res;
    obj = {
      test: {
        test: 'hello'
      }
    };
    res = PathHelper.PathHelper.getPath(obj, 'test.test');
    return (0, chai.expect)(res).to.eq('hello');
  });
  return it('can get a value at a path that does not exists', function () {
    var obj, res;
    obj = {};
    res = PathHelper.PathHelper.getPath(obj, 'test.test');
    return (0, chai.expect)(res).to.be.undefined;
  });
});

