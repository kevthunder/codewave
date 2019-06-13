import {expect} from 'chai'
import {Codewave} from '../../lib/bootstrap'
import {Logger} from '../../lib/Logger'
import {TextParser} from '../../lib/TextParser'
import {setEditorContent, assertEditorResult} from '../testHelpers/test_utils'
import { StringHelper } from '../../lib/helpers/StringHelper';
import { resolve, normalize } from 'path'
import { promisify } from 'util'
import { unlink, exists } from 'fs'
import { LocalFiles } from '../../lib/fileSystem/LocalFiles';

describe 'Codewave - file namespace', ->
  beforeEach ->
    Logger.enabled = false;
    @root = resolve("./test/tmp/")
    @storage = new LocalFiles(@root)
    @editor = new TextParser()
    @editor.fileSystem = @storage
    @codewave = new Codewave(@editor)
    
  afterEach ->
    delete @codewave
    delete @storage
    promisify(unlink)(@file).catch =>
        null
    
  it 'read a file', ->
    @storage.writeFile('hello','Hello, world!').then =>
      setEditorContent @codewave.editor, 
        """~~file:read hello|~~"""
      @codewave.onActivationKey()
    .then =>
      expect(@codewave.editor.text()).to.eq("Hello, world!")

  it 'write a file', ->
    setEditorContent @codewave.editor, 
      """~~file:write hello Hello|~~"""
    @codewave.onActivationKey().then =>
      @storage.readFile('hello')
    .then (content)=>
      expect(content).to.eq("Hello")

    
         
