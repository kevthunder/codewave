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
      @_namespaces = Codewave.util.unique(npcs)
    return @_namespaces
  getCmd: (cmdName,nameSpaces = []) ->
    finder = @getFinder(cmdName,nameSpaces)
    return finder.find()
  getFinder: (cmdName,nameSpaces = []) ->
    return new Codewave.CmdFinder(cmdName, {
      namespaces: nameSpaces
      useDetectors: @isRoot()
      codewave: @codewave
      parentContext: this
    })
  isRoot: ->
    return !@parent?
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
    return new Codewave.CmdInstance(cmd,this)
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