import { LocalFiles } from '../../lib/fileSystem/LocalFiles';
import { expect } from 'chai'
import { resolve, normalize } from 'path'
import { promisify } from 'util'
import { unlink, exists } from 'fs'

describe 'LocalFiles', ->
  beforeEach ->
    @root = resolve("./test/tmp/")
    @storage = new LocalFiles(@root)
    
  afterEach ->
    delete @storage
    promisify(unlink)(@file).catch =>
        null

  it 'does not allow to use a path ousite the root folder', ->
    expect(@storage.realpath('../')).to.eq(@root+'/')
