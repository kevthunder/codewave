
import { PathHelper } from '../../lib/helpers/PathHelper';
import {expect} from 'chai'

describe 'PathHelper', ->

  it 'can set a value at a path', ->
    obj = {}
    res = PathHelper.setPath(obj,'test.test','hello')
    expect(obj).to.deep.eq({test:{test:'hello'}})

  it 'can get a value at a path', ->
    obj = {test:{test:'hello'}}
    res = PathHelper.getPath(obj,'test.test')
    expect(res).to.eq('hello')

  it 'can get a value at a path that does not exists', ->
    obj = {}
    res = PathHelper.getPath(obj,'test.test')
    expect(res).to.be.undefined;
