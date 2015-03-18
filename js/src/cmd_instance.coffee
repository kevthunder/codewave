class @Codewave.CmdInstance
  constructor: (@codewave,@pos,@str) ->
  
    unless @isEmpty()
      @_checkCloser()
      @opening = @str
      @noBracket = @_removeBracket(@str)
      @_splitComponents()
      @_findClosing()
      @_checkElongated()
      @_checkBox()
      @content = @removeIndentFromContent(@content)
  init: ->
    unless @isEmpty() || @inited
      @inited = true
      @getCmd()
      @_getCmdObj()
      @_parseParams(@rawParams)
      if @cmdObj?
        @cmdObj.init()
    this
  _checkCloser: ->
    noBracket = @_removeBracket(@str)
    if noBracket.substring(0,@codewave.closeChar.length) == @codewave.closeChar and f = @_findOpeningPos()
      @closingPos = new Codewave.util.StrPos(@pos, @str)
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
    @rawParams = parts.join(" ")
  _parseParams:(params) ->
    @params = []
    @named = {}
    if @cmd?
      @named = Codewave.util.merge(@named,@cmd.getDefaults(this))
      nameToParam = @cmd.getOption('nameToParam',this)
      if nameToParam? 
        @named[nameToParam] = @cmdName
    if params.length
      allowedNamed = @cmd.getOption('allowedNamed',this)
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
        else if chr == ':' and !name and !inStr and (!allowedNamed? or name in allowedNamed)
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
      @content = Codewave.util.trimEmptyLine(@codewave.editor.textSubstr(@pos+@str.length,f.pos))
      @str = @codewave.editor.textSubstr(@pos,f.pos+f.str.length)
  _findClosingPos: ->
    return @closingPos if @closingPos?
    closing = @codewave.brakets + @codewave.closeChar + @cmdName + @codewave.brakets
    opening = @codewave.brakets + @cmdName
    if f = @codewave.findMatchingPair(@pos+@str.length,opening,closing)
      @closingPos = f
  _checkElongated: ->
    endPos = @getEndPos()
    max = @codewave.editor.textLen()
    while endPos < max and @codewave.editor.textSubstr(endPos,endPos+@codewave.deco.length) == @codewave.deco
      endPos+=@codewave.deco.length
    if endPos >= max or @codewave.editor.textSubstr(endPos, endPos + @codewave.deco.length) in [' ',"\n","\r"]
      @str = @codewave.editor.textSubstr(@pos,endPos)
  _checkBox: ->
    cl = @codewave.wrapCommentLeft()
    cr = @codewave.wrapCommentRight()
    endPos = @getEndPos() + cr.length
    if @codewave.editor.textSubstr(@pos - cl.length,@pos) == cl and @codewave.editor.textSubstr(endPos - cr.length,endPos) == cr
      @pos = @pos - cl.length
      @str = @codewave.editor.textSubstr(@pos,endPos)
      @_removeCommentFromContent()
    else if @sameLinesPrefix().indexOf(cl) > -1 and @sameLinesSuffix().indexOf(cr) > -1
      @inBox = 1
      @_removeCommentFromContent()
  _removeCommentFromContent: ->
    if @content
      ecl = Codewave.util.escapeRegExp(@codewave.wrapCommentLeft())
      ecr = Codewave.util.escapeRegExp(@codewave.wrapCommentRight())
      ed = Codewave.util.escapeRegExp(@codewave.deco)
      re1 = new RegExp("^\\s*#{ecl}(?:#{ed})+\\s*(.*?)\\s*(?:#{ed})+#{ecr}$", "gm")
      re2 = new RegExp("^\\s*(?:#{ed})*#{ecr}\r?\n")
      re3 = new RegExp("\n\\s*#{ecl}(?:#{ed})*\\s*$")
      @content = @content.replace(re1,'$1').replace(re2,'').replace(re3,'')
  _getParentCmds: ->
    @parent = @codewave.getEnclosingCmd(@getEndPos())?.init()
  prevEOL: ->
    unless @_prevEOL?
      @_prevEOL = @codewave.findLineStart(@pos)
    @_prevEOL
  nextEOL: ->
    unless @_nextEOL?
      @_nextEOL = @codewave.findLineEnd(@getEndPos())
    @_nextEOL
  rawWithFullLines: ->
    unless @_rawWithFullLines?
      @_rawWithFullLines = @codewave.editor.textSubstr(@prevEOL(),@nextEOL())
    @_rawWithFullLines
  sameLinesPrefix: ->
    unless @_sameLinesPrefix?
      @_sameLinesPrefix = @codewave.editor.textSubstr(@prevEOL(),@pos)
    @_sameLinesPrefix
  sameLinesSuffix: ->
    unless @_sameLinesSuffix?
      @_sameLinesSuffix = @codewave.editor.textSubstr(@getEndPos(),@nextEOL())
    @_sameLinesSuffix
  getCmd: ->
    unless @cmd?
      @_getParentCmds()
      if @noBracket.substring(0,@codewave.noExecuteChar.length) == @codewave.noExecuteChar
        @cmd = Codewave.Command.cmds.getCmd('core:no_execute')
      else
        @finder = @_getFinder(@cmdName)
        @cmd = @finder.find()
    @cmd
  _getFinder: (cmdName)->
    finder = @codewave.getFinder(cmdName,@_getParentNamespaces())
    finder.instance = this
    finder
  _getCmdObj: ->
    if @cmd?
      @cmdObj = @cmd.getExecutableObj(this)
  _getParentNamespaces: ->
    nspcs = []
    obj = this
    while obj.parent?
      obj = obj.parent
      nspcs.push(obj.cmd.fullName) if obj.cmd? and obj.cmd.fullName?
    nspcs
  _removeBracket: (str)->
    str.substring(@codewave.brakets.length,str.length-@codewave.brakets.length)
  isEmpty: ->
    @str == @codewave.brakets + @codewave.closeChar + @codewave.brakets or @str == @codewave.brakets + @codewave.brakets
  getParam: (names, defVal = null) ->
    names = [names] if (typeof names == 'string')
    for n in names
      return @named[n] if @named[n]?
      return @params[n] if @params[n]?
    defVal
  execute: ->
    if @isEmpty()
      if @codewave.closingPromp? && @codewave.closingPromp.whithinOpenBounds(@pos+@codewave.brakets.length)?
        @codewave.closingPromp.cancel()
      else
        @replaceWith('')
    else if @cmd?
      if beforeFunct = @cmd.getOption('beforeExecute',this)
        beforeFunct(this)
      if @cmd.resultIsAvailable(this)
        if (res = @cmd.result(this))?
          res = @formatIndent(res)
          if @cmd.getOption('parse',this) 
            parser = @getParserForText(res)
            res = parser.parseAll()
          if alterFunct = @cmd.getOption('alterResult',this)
            res = alterFunct(res,this)
          @replaceWith(res)
          return true
      else
          return @cmd.execute(this)
  result: -> 
    if @cmd.resultIsAvailable()
      @formatIndent(@cmd.result(this))
  getParserForText: (txt) ->
    parser = new Codewave(new Codewave.TextParser(txt))
    parser.context = this
    parser.checkCarret = false
    return parser
  getEndPos: ->
    @pos+@str.length
  getPos: ->
    new Codewave.util.Pos(@pos,@pos+@str.length)
  getIndent: ->
    unless @indentLen?
      if @inBox?
        helper = new Codewave.util.BoxHelper(@codewave)
        @indentLen = helper.removeComment(@sameLinesPrefix()).length
      else
        @indentLen = @pos - @codewave.findLineStart(@pos)
    @indentLen
  formatIndent: (text) ->
    if text?
      text.replace(/\t/g,'  ')
    else
      text
  applyIndent: (text) ->
    if text?
      reg = /\n/g
      text.replace(reg, "\n" + Codewave.util.repeatToLength(" ", @getIndent()))
    else
      text
  removeIndentFromContent: (text) ->
    if text?
      reg = new RegExp('^\\s{'+@getIndent()+'}','gm')
      text.replace(reg,'')
    else
      text
  alterResultForBox: (repl) ->
    helper = new Codewave.util.BoxHelper(@codewave)
    helper.getOptFromLine(@rawWithFullLines(),false)
    if @cmd.getOption('replaceBox',this)
      box = helper.getBoxForPos(@getPos())
      [repl.start, repl.end] = [box.start, box.end]
      @indentLen = helper.indent
      repl.text = @applyIndent(repl.text)
    else
      repl.text = @applyIndent(repl.text)
      repl.start = @prevEOL()
      repl.end = @nextEOL()
      res = helper.reformatLines(@sameLinesPrefix() + @codewave.marker + repl.text + @codewave.marker + @sameLinesSuffix(), {multiline:false})
      [repl.prefix,repl.text,repl.suffix] = res.split(@codewave.marker)
    repl
  getCursorFromResult: (repl) ->
    cursorPos = repl.resPosBeforePrefix()
    if @cmd? and @codewave.checkCarret and @cmd.getOption('checkCarret',this)
      if (p = @codewave.getCarretPos(repl.text))? 
        cursorPos = repl.start+repl.prefix.length+p
      repl.text = @codewave.removeCarret(repl.text)
    cursorPos
  replaceWith: (text) ->
    repl = new Codewave.util.Replacement(@pos,@getEndPos(),text)
    
    if @inBox?
      @alterResultForBox(repl)
    else
      repl.text = @applyIndent(repl.text)
      
    cursorPos = @getCursorFromResult(repl)
    
    repl.applyToEditor(@codewave.editor)
    @codewave.editor.setCursorPos(cursorPos)
    @replaceStart = repl.start
    @replaceEnd = repl.resEnd()