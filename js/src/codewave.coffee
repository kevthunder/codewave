class @Codewave
  constructor: (@editor) ->
    @editor.onActivationKey = => @onActivationKey()
    
  onActivationKey: ->
    console.log('activation key')
    if(cmd = @cursorOnCommand())
      console.log(cmd)
      cmd.execute()
    else
      @addBrakets()
  
  cursorOnCommand: ->
    cpos = @editor.getCursorPos()
    pos = cpos.end
    prev = @findPrevBraket(if @isEndLine(pos) then pos else pos+1)
    return false unless prev?
    if prev >= pos-2
      pos = prev
      prev = @findPrevBraket(pos)
    next = @findNextBraket(pos)
    return false unless next? and @countPrevBraket(prev) % 2 == 0
    new Codewave.CmdInstance(this,prev,@editor.textSubstr(prev,next+@brakets.length))
  
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
    console.log(f)
    f.pos if f
  findAnyNext: (start,strings,direction = 1) -> 
    pos = start
    while true  
      return false unless 0 < pos < @editor.textLen()
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
  getCommentChar: ->
    '<!-- %s -->'
  brakets: '~~'
  deco: '~'
  closeChar: '/'