class @Codewave.DomKeyListener
  startListening: (target) ->
    target.onkeydown = (e) => 
      if e.keyCode == 69 && e.ctrlKey
        e.preventDefault()
        if @onActivationKey?
          @onActivationKey()
    target.onkeyup = (e) => 
      if @onAnyChange?
        @onAnyChange(e)
    target.onkeypress = (e) => 
      if @onAnyChange?
        @onAnyChange(e)

class @Codewave.TextAreaEditor extends Codewave.TextParser
  constructor: (@target) ->
    @obj = document.getElementById(@target)
    @startListening(document)
  startListening: Codewave.DomKeyListener.prototype.startListening
  selectionPropExists: ->
    "selectionStart" of @obj
  hasFocus: -> 
    document.activeElement is @obj
  text: (val) ->
    @obj.value = val if val?
    @obj.value
  getCursorPos: ->
    return @tmpCursorPos if @tmpCursorPos?
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
      @tmpCursorPos = ( start: start, end: end )
      @obj.selectionStart = start
      @obj.selectionEnd = end
      setTimeout (=>
        @tmpCursorPos = null
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
      