class @Codewave
  constructor: (@target) ->
    @keyListener = new Codewave.KeyListener()
    @editor = new Codewave.TextAreaEditor(@target)
    @keyListener.onActivationKey = => @onActivationKey()
    
  onActivationKey: ->
    console.log('activation key')
    console.log(@editor.getCursorPos())
    if(@cursorOnCommand())
    else
      @addBrakets()
    
  cursorOnCommand: ->
    cpos = @editor.getCursorPos()
    @findNextBraket(cpos.end,[@brakets,"\n"])?
    
  findNextBraket: (start,direction = 1) -> 
    f = @findAnyNext(start,[@brakets,"\n"])
    f.pos if f and f.str == @brakets
    
  findAnyNext: (start,strings,direction = 1) -> 
    pos = start
    while true  
      return false unless 0 < pos < @editor.textLen()
      pos += direction
      for str in strings
        [start, end] = [pos, pos + str.length * direction]
        [start, end] = [end, start] if end < start
        if str == @editor.textSubstr(start,end)
          return (
            str: str
            pos: pos
          )
    
  addBrakets: ->
    cpos = @editor.getCursorPos()
    @editor.insertTextAt(@brakets,cpos.end)
    @editor.insertTextAt(@brakets,cpos.start)
    @editor.setCursorPos(cpos.end+@brakets.length)
  brakets: '~~'
  
class @Codewave.TextAreaEditor
  constructor: (@target) ->
    @obj = document.getElementById(@target)
  selectionPropExists: ->
    "selectionStart" of @obj
  hasFocus: -> 
    document.activeElement is @obj
  textCharAt: (pos) ->
    @obj.value[pos]
  textLen: (pos) ->
    @obj.value.length
  textSubstr: (start, end) ->
    @obj.value.substring(start, end)
  insertTextAt: (text, pos) ->
    @obj.value = @obj.value.substring(0, pos)+text+@obj.value.substring(pos,@obj.value.length);
  getCursorPos: ->
    if @hasFocus
      if @selectionPropExists
        (
          start: @obj.selectionStart
          end: @obj.selectionEnd
        )
      else
        @getCursorPosFallback()
  getCursorPosFallback: ->
    if @obj.createTextRange
      sel = document.selection.createRange()
      if sel.parentElement() is @obj
        rng = @obj.createTextRange()
        rng.moveToBookmark sel.getBookmark()
        len = 0

        while rng.compareEndPoints("EndToStart", rng) > 0
          len++
          rng.moveEnd("character", -1)
        rng.setEndPoint "StartToStart", @obj.createTextRange()
        pos =
          start: 0
          end: len
        while rng.compareEndPoints("EndToStart", rng) > 0
          pos.start++
          pos.end++
          rng.moveEnd("character", -1)
        return pos
  setCursorPos: (start, end) ->
    end = start if arguments.length < 2
    if @selectionPropExists
      setTimeout (=>
        @obj.selectionStart = start
        @obj.selectionEnd = end
      ), 1
    else 
      @setCursorPosFallback(start, end)
    return
  setCursorPosFallback: (start, end) ->
    if @obj.createTextRange
      rng = @obj.createTextRange()
      rng.moveStart "character", start
      rng.collapse()
      rng.moveEnd "character", end - start
      rng.select()
    
class @Codewave.KeyListener
  constructor: (@target) ->
    document.onkeydown = (e) => 
      if e.keyCode == 69 && e.ctrlKey
        e.preventDefault()
        if @onActivationKey?
          @onActivationKey()