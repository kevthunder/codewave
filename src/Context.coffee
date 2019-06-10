
import { CmdFinder } from './CmdFinder';
import { CmdInstance } from './CmdInstance';
import { ArrayHelper } from './helpers/ArrayHelper';

export class Context
  constructor: (@codewave) ->
    @nameSpaces = []
  
  addNameSpace: (name) ->
    if name not in @nameSpaces 
      @nameSpaces.push(name)
      @_namespaces = null
  addNamespaces: (spaces) ->
    if spaces 
      if typeof spaces == 'string'
        spaces = [spaces]
      for space in spaces 
        @addNameSpace(space)
  removeNameSpace: (name) ->
    @nameSpaces = @nameSpaces.filter (n) -> n isnt name

  getNameSpaces: ->
    unless @_namespaces?
      npcs = ['core'].concat(@nameSpaces)
      if @parent?
        npcs = npcs.concat(@parent.getNameSpaces())
      @_namespaces = ArrayHelper.unique(npcs)
    return @_namespaces
  getCmd: (cmdName,options = {}) ->
    finder = @getFinder(cmdName,options)
    return finder.find()
  getFinder: (cmdName,options = {}) ->
    return new CmdFinder(cmdName, Object.assign({
      namespaces: []
      useDetectors: @isRoot()
      codewave: @codewave
      parentContext: this
    },options))
  isRoot: ->
    return !@parent?
  getParentOrRoot: () ->
    if @parent?
      @parent
    else
      this
  wrapComment: (str) ->
    cc = @getCommentChar()
    if cc.indexOf('%s') > -1
      return cc.replace('%s',str)
    else
      return cc + ' ' + str + ' ' + cc
  wrapCommentLeft: (str = '') ->
    cc = @getCommentChar()
    if (i = cc.indexOf('%s')) > -1
      return cc.substr(0,i) + str
    else
      return cc + ' ' + str
  wrapCommentRight: (str = '') ->
    cc = @getCommentChar()
    if (i = cc.indexOf('%s')) > -1
      return str + cc.substr(i+2)
    else
      return str + ' ' + cc
  cmdInstanceFor: (cmd) ->
    return new CmdInstance(cmd,this)
  getCommentChar: ->
    if @commentChar?
      return @commentChar
    cmd = @getCmd('comment')
    char = '<!-- %s -->'
    if cmd?
      inst = @cmdInstanceFor(cmd)
      inst.content = '%s'
      res = inst.result()
      if res?
        char = res
    @commentChar = char
    return @commentChar