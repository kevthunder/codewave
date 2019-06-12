"use strict";

var _PathHelper = require("../../lib/helpers/PathHelper");

var _chai = require("chai");

describe('PathHelper', function () {
  it('can set a value at a path', function () {
    var obj, res;
    obj = {};
    res = _PathHelper.PathHelper.setPath(obj, 'test.test', 'hello');
    return (0, _chai.expect)(obj).to.deep.eq({
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
    res = _PathHelper.PathHelper.getPath(obj, 'test.test');
    return (0, _chai.expect)(res).to.eq('hello');
  });
  return it('can get a value at a path that does not exists', function () {
    var obj, res;
    obj = {};
    res = _PathHelper.PathHelper.getPath(obj, 'test.test');
    return (0, _chai.expect)(res).to.be.undefined;
  });
});
//# sourceMappingURL=../maps/helpers/pathHelper.js.map
