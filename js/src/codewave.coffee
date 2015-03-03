


class @Codewave
  constructor: (@editor,options...) ->
    @nameSpaces = []
    @vars = {}
    
    @parent = options['parent'] or null
    delete options['parent']
    defaults = {
      'brakets' : '~~',
      'deco' : '~',
      'closeChar' : '/',
      'noExecuteChar' : '!',
      'carretChar' : '|',
      'checkCarret' : true
    }
    
    for key, val of defaults
      if key of options
        this[key] = options[key]
      else if @parent? 
        this[key] = @parent[key]
      else
        this[key] = val
    @editor.bindedTo(this) if @editor?
  onActivationKey: ->
    Codewave.logger.log('activation key')
    
    if(cmd = @commandOnCursorPos()?.init())
      Codewave.logger.log(cmd)
      cmd.execute()
    else
      cpos = @editor.getCursorPos()
      if cpos.start == cpos.end
        @addBrakets(cpos.start,cpos.end)
      else
        @promptClosingCmd(cpos.start,cpos.end)
  commandOnCursorPos: ->
    cpos = @editor.getCursorPos()
    @commandOnPos(cpos.end)
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
    return new Codewave.CmdInstance(this,prev,@editor.textSubstr(prev,next+@brakets.length))
  nextCmd: (start = 0) ->
    pos = start
    while f = @findAnyNext(pos ,[@brakets,"\n"])
      pos = f.pos + f.str.length
      if f.str == @brakets
        if beginning?
          return new Codewave.CmdInstance(this,beginning,@editor.textSubstr(beginning,f.pos+@brakets.length))
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
    i
  isEndLine: (pos) -> 
    @editor.textSubstr(pos,pos+1) == "\n" or pos + 1 >= @editor.textLen()
  findLineStart: (pos) -> 
    p = @findAnyNext(pos ,["\n"], -1)
    if p then p.pos+1 else 0
  findPrevBraket: (start) -> 
    @findNextBraket(start,-1)
  findNextBraket: (start,direction = 1) -> 
    f = @findAnyNext(start ,[@brakets,"\n"], direction)
    
    f.pos if f and f.str == @brakets
  findPrev: (start,string) -> 
    @findNext(start,string,-1)
  findNext: (start,string,direction = 1) -> 
    f = @findAnyNext(start ,[string], direction)
    f.pos if f
  findAnyNext: (start,strings,direction = 1) -> 
    pos = start
    while true  
    
      return null unless 0 <= pos < @editor.textLen()
      for str in strings
        [start, end] = [pos, pos + str.length * direction]
        
        [start, end] = [end, start] if end < start
        if str == @editor.textSubstr(start,end)
          return (
            str: str
            pos: if direction < 0 then pos-str.length else pos
          )
      pos += direction
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
  addBrakets: (start, end) ->
    if start == end
      @editor.insertTextAt(@brakets+@brakets,start)
    else
      @editor.insertTextAt(@brakets,end)
      @editor.insertTextAt(@brakets,start)
    @editor.setCursorPos(end+@brakets.length)
  promptClosingCmd: (start, end) ->
    @closingPromp.stop() if @closingPromp?
    @closingPromp = (new Codewave.ClosingPromp(this,start, end)).begin()
  parseAll: (recursive = true) ->
    pos = 0
    while cmd = @nextCmd(pos)
      pos = cmd.getEndPos()
      @editor.setCursorPos(pos)
      if recursive && cmd.content? 
        parser = new Codewave(new Codewave.TextParser(cmd.content))
        cmd.content = parser.parseAll()
      if cmd.init().execute()?
        if(cmd.replaceEnd?)
          pos = cmd.replaceEnd
        else
          pos = @editor.getCursorPos().end
    @getText()
  getText: ->
    @editor.text()
  getNameSpaces: () ->
    npcs = ['core'].concat(@nameSpaces)
    if @parent?
      npcs = npcs.concat(@parent.getNameSpaces())
    if @context?
      if @context.finder?
        npcs = npcs.concat(@context.finder.namespaces)
      npcs = npcs.concat([@context.cmd.fullName])
    return Codewave.util.unique(npcs)
  addNameSpace: (name) ->
    @nameSpaces.push(name)
  removeNameSpace: (name) ->
    @nameSpaces = @nameSpaces.filter (n) -> n isnt name
  getCmd: (cmdName,nameSpaces = []) ->
    finder = @getFinder(cmdName,nameSpaces)
    finder.find()
  getFinder: (cmdName,nameSpaces = []) ->
    return new Codewave.CmdFinder(cmdName,{
      namespaces: Codewave.util.union(@getNameSpaces(),nameSpaces)
      useDetectors: @isRoot()
      codewave: this
    })
  isRoot: ->
    return !@parent? and (!@context? or !@context.finder?)
  getCommentChar: ->
    '<!-- %s -->'
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
  removeCarret: (txt) ->
    tmp = '[[[[quoted_carret]]]]'
    reCarret = new RegExp(Codewave.util.escapeRegExp(@carretChar), "g")
    reQuoted = new RegExp(Codewave.util.escapeRegExp(@carretChar+@carretChar), "g")
    reTmp = new RegExp(Codewave.util.escapeRegExp(tmp), "g")
    txt.replace(reQuoted,tmp).replace(reCarret,'').replace(reTmp, @carretChar)
  getCarretPos: (txt) ->
    txt = txt.replace(@carretChar+@carretChar, ' ')
    if (i = txt.indexOf(@carretChar)) > -1
      return i

@Codewave.init = ->
  Codewave.Command.initCmds()
  Codewave.Command.loadCmds()