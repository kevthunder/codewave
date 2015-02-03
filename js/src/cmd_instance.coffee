class @Codewave.CmdInstance
  constructor: (@codewave,@pos,@str) ->
    @_checkCloser()
    @opening = @str
    @noBracket = @_removeBracket(@str)
    @_splitComponents()
    @_findClosing()
    @_checkElongated()
    @_checkBox()
  init: ->
    @_getParentCmds()
    @_getCmd()
    this
  _checkCloser: ->
    noBracket = @_removeBracket(@str)
    if noBracket.substring(0,@codewave.closeChar.length) == @codewave.closeChar and f = @_findOpeningPos()
      @closingPos = pos:@pos, str:@str
      @pos = f.pos
      @str = f.str
  _findOpeningPos: ->
    cmdName = @_removeBracket(@str).substring(@codewave.closeChar.length)
    opening = @codewave.brakets + cmdName
    closing = @str
    if f = @codewave.findMatchingPair(@pos,opening,closing,-1)
      f.str = @codewave.editor.textSubstr(f.pos,@codewave.findNextBraket(f.pos+f.str.length)+@codewave.brakets.length)
      return f
  _splitComponents: ->
    parts = @noBracket.split(" ");
    @cmdName = parts.shift()
    @_parseParams(parts.join(" "))
  _parseParams:(params) ->
    @params = []
    @named = {}
    if params.length
      inStr = false
      param = ''
      name = false
      for i in [0..(params.length-1)]
        chr = params[i]
        if chr == ' ' and !inStr
          if(name)
            @named[name] = param
          else
            @params.push(param)
          param = ''
          name = false
        else if chr == '"' and (i == 0 or params[i-1] != '\\')
          inStr = !inStr
        else if chr == ':' and !name and !inStr
          name = param
          param = ''
        else
          param += chr
      if param.length
        if(name)
          @named[name] = param
        else
          @params.push(param)
  _findClosing: ->
    if f = @_findClosingPos()
      @content = @codewave.editor.textSubstr(@pos+@str.length,f.pos).replace(/^\n/m,'').replace(/\n$/m,'')
      @str = @codewave.editor.textSubstr(@pos,f.pos+f.str.length)
  _findClosingPos: ->
    return @closingPos if @closingPos?
    closing = @codewave.brakets + @codewave.closeChar + @cmdName + @codewave.brakets
    opening = @codewave.brakets + @cmdName
    if f = @codewave.findMatchingPair(@pos+@str.length,opening,closing)
      @closingPos = f
  _checkElongated: ->
    endPos = @getEndPos()
    while @codewave.editor.textSubstr(endPos,endPos+@codewave.deco.length) == @codewave.deco
      endPos+=@codewave.deco.length
    if @codewave.editor.textSubstr(endPos,endPos+@codewave.deco.length) in [' ',"\n"]
      @str = @codewave.editor.textSubstr(@pos,endPos)
  _checkBox: ->
    cl = @codewave.wrapCommentLeft()
    cr = @codewave.wrapCommentRight()
    endPos = @getEndPos() + cr.length
    if @codewave.editor.textSubstr(@pos - cl.length,@pos) == cl and @codewave.editor.textSubstr(endPos - cr.length,endPos) == cr
      @pos = @pos - cl.length
      @str = @codewave.editor.textSubstr(@pos,endPos)
      @_removeCommentFromContent()
  _removeCommentFromContent: ->
    if @content
      ecl = Codewave.util.escapeRegExp(@codewave.wrapCommentLeft())
      ecr = Codewave.util.escapeRegExp(@codewave.wrapCommentRight())
      ed = Codewave.util.escapeRegExp(@codewave.deco)
      re1 = new RegExp("^\\s*#{ecl}(?:#{ed})+\\s*(.*?)\\s*(?:#{ed})+#{ecr}$", "gm")
      re2 = new RegExp("^(?:#{ed})*#{ecr}\n", "")
      re3 = new RegExp("\n\\s*#{ecl}(?:#{ed})*$", "")
      @content = @content.replace(re1,'$1').replace(re2,'').replace(re3,'')
  _getParentCmds: () ->
    @parent = @codewave.getEnclosingCmd(@getEndPos())?.init()
  _getCmd: ->
    if @noBracket.substring(0,@codewave.noExecuteChar.length) == @codewave.noExecuteChar
      @cmd = Codewave.cmd.core.cmd.no_execute
    else
      @cmd = @codewave.getCmd(@cmdName,@_getParentNamespaces())
    @cmdObj = if @cmd?.cls? then new @cmd.cls(this) else @cmd
    @cmd
  _getParentNamespaces: ->
    nspcs = []
    obj = this
    while obj.parent
      obj = obj.parent
      nspcs.push(obj.cmd.fullname) if obj.cmd?
    nspcs
  _removeBracket: (str)->
    str.substring(@codewave.brakets.length,str.length-@codewave.brakets.length)
  getParam: (names, defVal = null) ->
    names = [names] if (typeof names == 'string')
    for n in names
      return @named[n] if @named[n]?
      return @params[n] if @params[n]?
    defVal
  execute: ->
    if @cmdObj?
      if @cmdObj.execute?
        @cmdObj.execute(this)
      else if (r = @result())?
        @replaceWith(r)
  result: -> 
      if @cmdObj?.result?
        if typeof(@cmdObj.result) == "function"
          @cmdObj.result(this)
        else
          @cmdObj.result
  getEndPos: ->
    @pos+@str.length
  getIndent: ->
    @pos - @codewave.findLineStart(@pos)
  applyIndent: (text) ->
    text.replace(/\n/g,"\n"+Array(@getIndent()+1).join(" "))
  replaceWith: (text) ->
    text = @applyIndent(text)
    
    if @codewave.checkCarret
      cursorPos = if (p = text.indexOf(@codewave.carretChar)) > -1
        text = @codewave.removeCarret(text)
        @pos+p
      else
        @pos+text.length
      
      
    @codewave.editor.spliceText(@pos,@getEndPos(),text)
    @codewave.editor.setCursorPos(cursorPos)
    @replaceStart = @pos
    @replaceEnd = @pos+text.length