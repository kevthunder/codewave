# [pawa]
#   replace 'class @Codewave' 'class Codewave():'
#   replace /cpos.(\w+)/ cpos['$1']
#   replace 'new Codewave(' Codewave(
#   replace '@Codewave.init = ->' 'def init():'


class @Codewave
  constructor: (@editor, options = {}) ->
    # Codewave.logger.toMonitor(this,'runAtCursorPos')
    @marker = '[[[[codewave_marquer]]]]'
    @vars = {}
    
    defaults = {
      'brakets' : '~~',
      'deco' : '~',
      'closeChar' : '/',
      'noExecuteChar' : '!',
      'carretChar' : '|',
      'checkCarret' : true,
      'inInstance' : null
    }
    @parent = options['parent']
    
    for key, val of defaults
      if key of options
        this[key] = options[key]
      else if @parent? and key != 'parent'
        this[key] = @parent[key]
      else
        this[key] = val
    @editor.bindedTo(this) if @editor?
    
    @context = new Codewave.Context(this)
    if @inInstance?
      @context.parent = @inInstance.context
  onActivationKey: ->
    @process = new Codewave.Process()
    Codewave.logger.log('activation key')
    @runAtCursorPos()
    # Codewave.logger.resume()
    @process = null
  runAtCursorPos: ->
    if @editor.allowMultiSelection()
      @runAtMultiPos(@editor.getMultiSel())
    else
      @runAtPos(@editor.getCursorPos())
  runAtPos: (pos)->
    @runAtMultiPos([pos])
  runAtMultiPos: (multiPos)->
    if multiPos.length > 0
      cmd = @commandOnPos(multiPos[0].end)
      if cmd?
        if multiPos.length > 1
          cmd.setMultiPos(multiPos)
        cmd.init()
        Codewave.logger.log(cmd)
        cmd.execute()
      else
        if multiPos[0].start == multiPos[0].end
          @addBrakets(multiPos)
        else
          @promptClosingCmd(multiPos)
  commandOnPos: (pos) ->
    if @precededByBrakets(pos) and @followedByBrakets(pos) and @countPrevBraket(pos) % 2 == 1 
      prev = pos-@brakets.length
      next = pos
    else
      if @precededByBrakets(pos) and @countPrevBraket(pos) % 2 == 0
        pos -= @brakets.length
      prev = @findPrevBraket(pos)
      unless prev?
        return null 
      next = @findNextBraket(pos-1)
      if next is null or @countPrevBraket(prev) % 2 != 0 
        return null
    return new Codewave.PositionedCmdInstance(this,prev,@editor.textSubstr(prev,next+@brakets.length))
  nextCmd: (start = 0) ->
    pos = start
    while f = @findAnyNext(pos ,[@brakets,"\n"])
      pos = f.pos + f.str.length
      if f.str == @brakets
        if beginning?
          return new Codewave.PositionedCmdInstance(this, beginning, @editor.textSubstr(beginning, f.pos+@brakets.length))
        else
          beginning = f.pos
      else
        beginning = null
    null
  getEnclosingCmd: (pos = 0) ->
    cpos = pos
    closingPrefix = @brakets + @closeChar
    while (p = @findNext(cpos,closingPrefix))?
      if cmd = @commandOnPos(p+closingPrefix.length)
        cpos = cmd.getEndPos()
        if cmd.pos < pos
          return cmd
      else
        cpos = p+closingPrefix.length
    null
  precededByBrakets: (pos) ->
    return @editor.textSubstr(pos-@brakets.length,pos) == @brakets
  followedByBrakets: (pos) ->
    return @editor.textSubstr(pos,pos+@brakets.length) == @brakets
  countPrevBraket: (start) -> 
    i = 0
    while start = @findPrevBraket(start)
      i++
    return i
  isEndLine: (pos) -> 
    return @editor.textSubstr(pos,pos+1) == "\n" or pos + 1 >= @editor.textLen()
  findLineStart: (pos) -> 
    p = @findAnyNext(pos ,["\n"], -1)
    if p then p.pos+1 else 0
  findLineEnd: (pos) -> 
    p = @findAnyNext(pos ,["\n","\r"])
    if p then p.pos else @editor.textLen()
  findPrevBraket: (start) -> 
    return @findNextBraket(start,-1)
  findNextBraket: (start,direction = 1) -> 
    f = @findAnyNext(start ,[@brakets,"\n"], direction)
    
    f.pos if f and f.str == @brakets
  findPrev: (start,string) -> 
    return @findNext(start,string,-1)
  findNext: (start,string,direction = 1) -> 
    f = @findAnyNext(start ,[string], direction)
    f.pos if f
  
  findAnyNext: (start,strings,direction = 1) -> 
    if direction > 0
      text = @editor.textSubstr(start,@editor.textLen())
    else
      text = @editor.textSubstr(0,start)
    bestPos = null
    for stri in strings
      pos = if direction > 0 then text.indexOf(stri) else text.lastIndexOf(stri)
      if pos != -1
        if !bestPos? or bestPos*direction > pos*direction
          bestPos = pos
          bestStr = stri
    if bestStr?
      return new Codewave.util.StrPos((if direction > 0 then bestPos + start else bestPos),bestStr)
    return null
  findMatchingPair: (startPos,opening,closing,direction = 1) ->
    pos = startPos
    nested = 0
    while f = @findAnyNext(pos,[closing,opening],direction)
      pos = f.pos + (if direction > 0 then f.str.length else 0)
      if f.str == (if direction > 0 then closing else opening)
        if nested > 0
          nested--
        else
          return f
      else
        nested++
    null
  addBrakets: (pos) ->
    pos = Codewave.util.posCollection(pos)
    replacements = pos.wrap(@brakets,@brakets).map( (r)->r.selectContent() )
    @editor.applyReplacements(replacements)
  promptClosingCmd: (selections) ->
    @closingPromp.stop() if @closingPromp?
    @closingPromp = (new Codewave.ClosingPromp(this,selections)).begin() # [pawa python] replace /\(new (.*)\).begin/ $1.begin reparse
  parseAll: (recursive = true) ->
    pos = 0
    while cmd = @nextCmd(pos)
      pos = cmd.getEndPos()
      @editor.setCursorPos(pos)
      cmd.init()
      if recursive and cmd.content? and (!cmd.getCmd()? or !cmd.getOption('preventParseAll'))
        parser = new Codewave(new Codewave.TextParser(cmd.content), {parent: this})
        cmd.content = parser.parseAll()
      if cmd.execute()?
        if cmd.replaceEnd?
          pos = cmd.replaceEnd
        else
          pos = @editor.getCursorPos().end
    return @getText()
  getText: ->
    return @editor.text()
  isRoot: ->
    return !@parent? and (!@inInstance? or !@inInstance.finder?)
  getRoot: ->
    if @isRoot
      return this
    else if @parent?
      return @parent.getRoot()
    else if @inInstance?
      return @inInstance.codewave.getRoot()
  removeCarret: (txt) ->
    return CodeWave.util.removeCarret(txt,@carretChar)
  getCarretPos: (txt) ->
    return CodeWave.util.getCarretPos(txt,@carretChar)
  regMarker: (flags="g") -> # [pawa python] replace flags="g" flags=0 
    return new RegExp(Codewave.util.escapeRegExp(@marker), flags)
  removeMarkers: (text) ->
    return text.replace(@regMarker(),'') # [pawa python] replace @regMarker() self.marker 

@Codewave.init = ->
  Codewave.Command.initCmds()
  Codewave.Command.loadCmds()