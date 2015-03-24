class @Codewave.Context
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

  getNameSpaces: () ->
    unless @_namespaces?
      npcs = ['core'].concat(@nameSpaces)
      if @parent?
        npcs = npcs.concat(@parent.getNameSpaces())
      @_namespaces = Codewave.util.unique(npcs)
    return @_namespaces
  getCmd: (cmdName,nameSpaces = []) ->
    finder = @getFinder(cmdName,nameSpaces)
    finder.find()
  getFinder: (cmdName,nameSpaces = []) ->
    return new Codewave.CmdFinder(cmdName, {
      namespaces: nameSpaces
      useDetectors: @isRoot()
      codewave: @codewave
      parentContext: this
    })
  isRoot: ->
    !@parent?
  wrapComment: (str) ->
    cc = @getCommentChar()
    if cc.indexOf('%s') > -1
      cc.replace('%s',str)
    else
      cc + ' ' + str + ' ' + cc
  wrapCommentLeft: (str = '') ->
    cc = @getCommentChar()
    console.log()
    if (i = cc.indexOf('%s')) > -1
      cc.substr(0,i) + str
    else
      cc + ' ' + str
  wrapCommentRight: (str = '') ->
    cc = @getCommentChar()
    if (i = cc.indexOf('%s')) > -1
      str + cc.substr(i+2)
    else
      str + ' ' + cc
  getCommentChar: ->
    if @commentChar?
      return @commentChar
    cmd = @getCmd('comment')
    if cmd?
      res = cmd.result()
      if res?
        res = res.replace('~~content~~','%s')
        if @process?
          @commentChar = res
        return res
    '<!-- %s -->'