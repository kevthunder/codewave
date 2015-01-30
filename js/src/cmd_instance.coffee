class @Codewave.CmdInstance
  constructor: (@codewave,@pos,@str) ->
    @_checkCloser()
    @noBracket = @_removeBracket(@str)
    @_splitComponents()
    @_findClosing()
    @cmd = @_getCmd()
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
    @_parseParams(parts)
  _parseParams:(params) ->
    @params = []
    @named = {}
    for p in params
      parts = p.split(":");
      if parts.length > 1
        key = parts.shift()
        @named[key] = parts.join(":");
      else
        @params.push(p)
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
  _getCmd: ->
    cmd = Codewave.cmd[@cmdName]
    if typeof(cmd) == "function" and (cmd.prototype.execute? or cmd.prototype.result?)
      new cmd(this)
    else
      cmd
  _removeBracket: (str)->
    str.substring(@codewave.brakets.length,str.length-@codewave.brakets.length)
  getParam: (names, def) ->
    names = [names] if typeof names == 'string'
    for n in names
      return @named[n] if @named[n]?
      return @params[n] if @params[n]?
    def
  execute: ->
    if @cmd?
      if @cmd.execute?
        @cmd.execute(this)
      else if (r = @result())?
        @replaceWith(r)
  result: -> 
      if @cmd.result?
        if typeof(@cmd.result) == "function"
          @cmd.result()
        else
          @cmd.result
      else if typeof @cmd == 'string'
        @cmd
      else if typeof(@cmd) == "function"
        @cmd()
  getEndPos: ->
    @pos+@str.length
  getIndent: ->
    @pos - @codewave.findLineStart(@pos)
  applyIndent: (text) ->
    text.replace(/\n/g,"\n"+Array(@getIndent()+1).join(" "))
  replaceWith: (text) ->
    text = @applyIndent(text)
    
    @codewave.editor.spliceText(@pos,@getEndPos(),text)
    @codewave.editor.setCursorPos(@pos+text.length)