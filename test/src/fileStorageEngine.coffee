import { FileStorageEngine } from '../lib/storageEngines/FileStorageEngine';
import { expect } from 'chai'
import { resolve } from 'path'
import { promisify } from 'util'
import { unlink, exists } from 'fs'

describe 'FileStorageEngine', ->
  beforeEach ->
    @file = resolve("./test/tmp/test.json")
    @storage = new FileStorageEngine(@file)
    
  afterEach ->
    delete @storage
    promisify(unlink)(@file).catch =>
        null
    

  it 'can save a key val pair', ->
    @storage.load('foo').then (res)=>
        expect(res).to.not.exist
        @storage.save('foo', "bar")
    .then =>
        @storage = new FileStorageEngine(@file)
        @storage.load('foo')
    .then (res)=>
        expect(res).to.eql("bar")
        promisify(exists)(@file)
    .then (exists)=>
        expect(exists).to.be.true

     
  it 'can delete everything stored', ->
    @storage.load('foo').then (res)=>
        expect(res).to.not.exist
        @storage.save('foo', "bar")
    .then =>
        @storage.load('foo')
    .then (res)=>
        expect(res).to.eql("bar")
        @storage.deleteFile()
    .then =>
        @storage.load('foo')
    .then (res)=>
        expect(res).to.not.exist
        promisify(exists)(@file)
    .then (exists)=>
        expect(exists).to.be.false