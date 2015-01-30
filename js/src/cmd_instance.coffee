class @Codewave.CmdInstance
  constructor: (@codewave,@pos,@str) ->
    @_checkCloser()
    @noBracket = @_removeBracket(@str)
    @_splitComponents()
    @_findClosing()
    @_checkBox()
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
    @_parseParams(parts.join(" "))
  _parseParams:(params) ->
    @params = []
    @named = {}
    inStr = false
    param = ''
    name = false
    for i in [0..params.length-1]
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
  _checkBox: ->
    cl = @codewave.wrapCommentLeft()
    cr = @codewave.wrapCommentRight()
    endPos = @getEndPos() + cr.length
    if @codewave.editor.textSubstr(@pos - cl.length,@pos) == cl and @codewave.editor.textSubstr(@getEndPos(),endPos) == cr
      console.log(@pos - cl.length)
      @pos = @pos - cl.length
      @str = @codewave.editor.textSubstr(@pos,endPos)
      @_removeCommentFromContent()
  _removeCommentFromContent: ->
    if @content
      ecl = Codewave.util.escapeRegExp(@codewave.wrapCommentLeft())
      ecr = Codewave.util.escapeRegExp(@codewave.wrapCommentRight())
      ed = Codewave.util.escapeRegExp(@codewave.deco)
      console.log("^\\s*#{ecl}(?:#{ed})+\\s*(.*?)\\s*(?:#{ed})+#{ecr}$")
      re1 = new RegExp("^\\s*#{ecl}(?:#{ed})+\\s*(.*?)\\s*(?:#{ed})+#{ecr}$", "gm")
      re2 = new RegExp("^(?:#{ed})*#{ecr}\n", "")
      re3 = new RegExp("\n\\s*#{ecl}(?:#{ed})*$", "")
      @content = @content.replace(re1,'$1').replace(re2,'').replace(re3,'')
  _getCmd: ->
    cmd = @codewave.getCmd(@cmdName)
    if typeof(cmd) == "function"
      cmd = new cmd(this)
    else 
      cmd
  _removeBracket: (str)->
    str.substring(@codewave.brakets.length,str.length-@codewave.brakets.length)
  getParam: (names, def) ->
    names = [names] if (typeof names == 'string')
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