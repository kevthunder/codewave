class @Codewave.DomKeyListener
  startListening: (target) ->
  
    timeout = null
    
    onkeydown = (e) => 
      if (Codewave.instances.length < 2 or @obj == document.activeElement) and e.keyCode == 69 && e.ctrlKey
        e.preventDefault()
        if @onActivationKey?
          @onActivationKey()
    onkeyup = (e) => 
      if @onAnyChange?
        @onAnyChange(e)
    onkeypress = (e) => 
      clearTimeout(timeout) if timeout?
      timeout = setTimeout (=>
        if @onAnyChange?
          @onAnyChange(e)
      ), 100
            
    if target.addEventListener
        target.addEventListener("keydown", onkeydown)
        target.addEventListener("keyup", onkeyup)
        target.addEventListener("keypress", onkeypress)
    else if target.attachEvent
        target.attachEvent("onkeydown", onkeydown)
        target.attachEvent("onkeyup", onkeyup)
        target.attachEvent("onkeypress", onkeypress)

isElement = (obj) ->
  try
    # Using W3 DOM2 (works for FF, Opera and Chrom)
    obj instanceof HTMLElement
  catch e
    # Browsers not supporting W3 DOM2 don't have HTMLElement and
    # an exception is thrown and we end up here. Testing some
    # properties that all elements have. (works on IE7)
    return (typeof obj=="object") &&
      (obj.nodeType==1) && (typeof obj.style == "object") &&
      (typeof obj.ownerDocument =="object")

        
class @Codewave.TextAreaEditor extends Codewave.TextParser
  constructor: (@target) ->
    super()
    # Codewave.logger.toMonitor(this,'textEventChange')
    @obj = if isElement(@target) then @target else document.getElementById(@target)
    unless @obj?
      throw "TextArea not found"
    @namespace = 'textarea'
    @changeListeners = []
    @_skipChangeEvent = 0
  startListening: Codewave.DomKeyListener.prototype.startListening
  onAnyChange: (e) ->
    if @_skipChangeEvent <= 0
      for callback in @changeListeners
        callback()
    else
      @_skipChangeEvent--
      @onSkipedChange() if @onSkipedChange?
  skipChangeEvent: (nb = 1) ->
    @_skipChangeEvent += nb
  bindedTo: (codewave) ->
    @onActivationKey = -> codewave.onActivationKey()
    @startListening(document)
  selectionPropExists: ->
    "selectionStart" of @obj
  hasFocus: -> 
    document.activeElement is @obj
  text: (val) ->
    if val?
      unless @textEventChange(val)
        @obj.value = val
    @obj.value
  spliceText: (start, end, text) ->
    @textEventChange(text, start, end) or super(start, end, text)
  textEventChange: (text, start = 0, end = null) ->
    event = document.createEvent('TextEvent') if document.createEvent?
    if event? and event.initTextEvent?
      end = @textLen() unless end?
      if text.length < 1
        if start != 0
          text = @textSubstr(start-1,start)
          start--
        else if end != @textLen()
          text = @textSubstr(end,end+1)
          end++
        else
          return false
      event.initTextEvent('textInput', true, true, null, text, 9)
      # @setCursorPos(start,end)
      @obj.selectionStart = start
      @obj.selectionEnd = end
      @obj.dispatchEvent(event)
      @skipChangeEvent()
      true
    else 
      false
  getCursorPos: ->
    return @tmpCursorPos if @tmpCursorPos?
    if @hasFocus
      if @selectionPropExists
        new Codewave.util.Pos(@obj.selectionStart,@obj.selectionEnd)
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
        pos = new Codewave.util.Pos(0,len)
        while rng.compareEndPoints("EndToStart", rng) > 0
          pos.start++
          pos.end++
          rng.moveEnd("character", -1)
        return pos
  setCursorPos: (start, end) ->
    end = start if arguments.length < 2
    if @selectionPropExists
      @tmpCursorPos = new Codewave.util.Pos(start,end)
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
  getLang: ->
    return @_lang if @_lang
    @obj.getAttribute('data-lang') if @obj.hasAttribute('data-lang')
  setLang: (val) ->
    @_lang = val
    @obj.setAttribute('data-lang',val)
  canListenToChange: ->
    return true
  addChangeListener: (callback) ->
    @changeListeners.push(callback)
  removeChangeListener: (callback) ->
    if (i = @changeListeners.indexOf(callback)) > -1
      @changeListeners.splice(i, 1)
      
      
  applyReplacements: (replacements) ->
    if replacements.length > 0 and replacements[0].selections.length < 1
      replacements[0].selections = [@getCursorPos()]
    super(replacements);
      