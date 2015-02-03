class @Codewave
  constructor: (@editor) ->
    @brakets = '~~'
    @deco = '~'
    @closeChar = '/'
    @noExecuteChar = '!'
    @carretChar = '|'
    @nameSpaces = []
    @checkCarret = yes
    @vars = {}
    @editor.onActivationKey = => @onActivationKey()
  onActivationKey: ->
    console.log('activation key')
    if(cmd = @commandOnCursorPos()?.init())
      console.log(cmd)
      cmd.execute()
    else
      @addBrakets()
  commandOnCursorPos: ->
    cpos = @editor.getCursorPos()
    @commandOnPos(cpos.end)
  commandOnPos: (pos) ->
    prev = @findPrevBraket(if @isEndLine(pos) then pos else pos+1)
    return null unless prev?
    if prev >= pos-2
      pos = prev
      prev = @findPrevBraket(pos)
    next = @findNextBraket(pos)
    return null unless next? and @countPrevBraket(prev) % 2 == 0
    new Codewave.CmdInstance(this,prev,@editor.textSubstr(prev,next+@brakets.length))
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
  addBrakets: ->
    cpos = @editor.getCursorPos()
    @editor.insertTextAt(@brakets,cpos.end)
    @editor.insertTextAt(@brakets,cpos.start)
    @editor.setCursorPos(cpos.end+@brakets.length)
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
    ['core'].concat(@nameSpaces)
  addNameSpace: (name) ->
    @nameSpaces.push(name)
  removeNameSpace: (name) ->
    @nameSpaces = @nameSpaces.filter (n) -> n isnt name
  getCmd: (cmdName) ->
    @getCmdFrom(cmdName,Codewave)
  uniformizeCmd: (cmd) ->
    if typeof(cmd) == "function"
        if cmd.prototype.execute? or cmd.prototype.result?
          (cls:cmd)
        else
          (result:cmd)
      else if typeof cmd == 'string'
        (result:cmd)
      else
        cmd
  prepCmd: (cmd,path=[]) ->
    if(cmd?)
      cmd = @uniformizeCmd(cmd)
      cmd.fullname = path.join(':')
      cmd
  getCmdFrom: (cmdName,space,path = []) ->
    if space? and space.cmd?
      if (p = cmdName.indexOf(':')) > -1
        cmdNameSpc = cmdName.substring(0,p)
        cmdNameAfter = cmdName.substring(p+1)
      for nspc in @getNameSpaces()
        spc = Codewave.getNameSpace(nspc,space)
        if cmd = @getCmdFrom(cmdName,spc,path.concat([nspc]))
          return cmd
      if cmdNameSpc? 
        if cmd = @getCmdFrom(cmdNameAfter,space.cmd[cmdNameSpc],path.concat([cmdNameSpc]))
          return cmd
      else if space.cmd[cmdName]?
        @prepCmd(space.cmd[cmdName],path.concat([cmdName]))
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
  removeCarret: (str) ->
    re = new RegExp(Codewave.util.escapeRegExp(@carretChar), "g")
    str.replace(re,'')

@Codewave.getNameSpace = (nspc,startSpace = Codewave) ->
    parts = nspc.split(':')
    spc = startSpace
    for pt in parts
      return null unless spc.cmd?[pt]?
      spc = spc.cmd[pt]
    spc
    
@Codewave.setCmd = (fullname,data,save = yes) ->
  parts = fullname.split(':')
  name = parts.pop()
  spc = Codewave
  for pt in parts
    spc.cmd[pt] = {} unless spc.cmd[pt]?
    spc = spc.cmd[pt]
    spc.cmd = {} unless spc.cmd?
  spc.cmd[name] = data
  if save
    saved = Codewave.storage.load('saved')
    saved = {} unless saved?
    saved[fullname] = data
    Codewave.storage.save('saved',saved)
  data
  
@Codewave.util = ( 
  escapeRegExp: (str) ->
    str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
)