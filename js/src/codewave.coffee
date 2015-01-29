class @Codewave
  constructor: (@target) ->
    @keyListener = new Codewave.KeyListener()
    @editor = new Codewave.TextAreaEditor(@target)
    @keyListener.onActivationKey = => @onActivationKey()
    
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
@Codewave.cmd = (
  hello: "Hello,\nWorld!",
  box: class
    constructor: (@instance)->
      @width = if @instance.params.length > 1
        parseInt(@instance.params[0])
      else
        50
        
      @height = if @instance.params.length > 1
        parseInt(@instance.params[1])
      else if @instance.params.length > 0
        parseInt(@instance.params[0])
      else
        3
        
      @commentChar = @instance.codewave.getCommentChar()
      @deco = @instance.codewave.deco
      @pad = 2
    execute: ->
      content = @separator() + "\n" + (@line() for x in [1..@height]).join("\n") + "\n"+ @separator()
      @instance.replaceWith(content)
    wrapComment: (str)->
      if @commentChar.indexOf('%s') > -1
        @commentChar.replace('%s',str)
      else
        @commentChar + ' ' + str + ' ' + @commentChar
    separator: ->
      len = @width + 2 * @pad + 2 * @deco.length
      @wrapComment(Array(Math.ceil(len/@deco.length)+1).join(@deco).substring(0,len))
    padding: -> 
      Array(@pad+1).join(" ")
    line: (text = '') ->
      @wrapComment(@deco + @padding() + text + Array(@width-text.length+1).join(" ") + @padding()+ @deco)
)



class @Codewave.CmdInstance
  constructor: (@codewave,@pos,@str) ->
    @noBracket = @_removeBracket(@str)
    @_splitComponents()
    @_findClosing()
    @cmd = @_getCmd()
  _splitComponents: ->
    parts = @noBracket.split(" ");
    @cmdName = parts.shift()
    @params = parts
  _findClosing: ->
    if f = @_findClosingPos()
      @content = @codewave.editor.textSubstr(@pos+@str.length,f.pos)
      @str = @codewave.editor.textSubstr(@pos,f.pos+f.str.length)
  _findClosingPos: ->
    close = @codewave.brakets + @codewave.closeChar + @cmdName + @codewave.brakets
    another = @codewave.brakets + @cmdName
    pos = @pos+@str.length
    nested = 0
    while f = @codewave.findAnyNext(pos,[close,another])
      pos = f.pos + f.str.length
      if f.str == close
        if nested > 0
          nested--
        else
          return f
      else
        nested++
    null
  _getCmd: ->
    cmd = Codewave.cmd[@cmdName]
    if typeof(cmd) == "function" and cmd.prototype.execute?
      new cmd(this)
    else
      cmd
  _removeBracket: (str)->
    str.substring(@codewave.brakets.length,str.length-@codewave.brakets.length)
  execute: ->
    if @cmd?
      if @cmd.execute?
        @cmd.execute(this)
      else if @cmd.content
        @replaceWith(@cmd.content)
      else if typeof @cmd == 'string'
        @replaceWith(@cmd)
  getIndent: ()->
    @pos - @codewave.findLineStart(@pos)
  applyIndent: (text) ->
    text.replace(/\n/g,"\n"+Array(@getIndent()+1).join(" "))
  replaceWith: (text) ->
    text = @applyIndent(text)
    
    @codewave.editor.spliceText(@pos,@pos+@str.length,text)
    @codewave.editor.setCursorPos(@pos+text.length)



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
  spliceText: (start, end, text) ->
    @obj.value = @obj.value.slice(0, start) + (text || "") + @obj.value.slice(end);
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