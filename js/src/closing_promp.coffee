class @Codewave.ClosingPromp
  constructor: (@codewave,selections) ->
    @timeout = null
    @_typed = null
    @started = false
    @selections = Codewave.util.posCollection(selections)
  begin: ->
    @started = true
    @addCarrets()
    if @codewave.editor.canListenToChange()
      @proxyOnChange = (ch=null)=> @onChange(ch)
      @codewave.editor.addChangeListener( @proxyOnChange )
      
    
    return this
  addCarrets: ->
    @replacements = @selections.wrap(
      @codewave.brakets+@codewave.carretChar+@codewave.brakets+"\n",
      "\n"+@codewave.brakets+@codewave.closeChar+@codewave.carretChar+@codewave.brakets
    ).map( (p) -> p.carretToSel() )
    @codewave.editor.applyReplacements(@replacements)
  invalidTyped: ->
    @_typed = null
  onChange: (ch = null)->
    @invalidTyped()
    if @skipEvent(ch)
      return
    if @shouldStop()
      @stop()
      @cleanClose()
    else
      @continue()
      
  skipEvent: (ch) ->
    return ch? and ch.charCodeAt(0) != 32
  
  continue: ->
    #
    
  shouldStop: ->
    return @typed() == false or @typed().indexOf(' ') != -1
  
  cleanClose: ->
    replacements = []
    selections = @getSelections()
    for sel in selections
      if pos = @whithinOpenBounds(sel)
        start = sel
      else if (end = @whithinCloseBounds(sel)) and start?
        res = end.innerTextFromEditor(@codewave.editor).split(' ')[0]
        repl = new Codewave.util.Replacement(end.innerStart,end.innerEnd,res)
        repl.selections = [start]
        replacements.push(repl)
        start = null
    @codewave.editor.applyReplacements(replacements)
  getSelections: ->
    @codewave.editor.getMultiSel()
  stop: ->
    throw "Nope"
    @started = false
    clearTimeout(@timeout) if @timeout?
    @codewave.closingPromp = null if @codewave.closingPromp == this
    if @proxyOnChange?
      @codewave.editor.removeChangeListener(@proxyOnChange)
  cancel: ->
    if @typed() != false
      @cancelSelections(@getSelections())
    @stop()
  cancelSelections: (selections) ->
    replacements = []
    start = null
    for sel in selections
      if pos = @whithinOpenBounds(sel)
        start = pos
      else if (end = @whithinCloseBounds(sel)) and start?
        start = null
        replacements.push(new Codewave.util.Replacement(start.start,end.end,@codewave.editor.textSubstr(start.end+1, end.start-1)).selectContent())
    @codewave.editor.applyReplacements(@replacements)
  typed: ->
    unless @_typed?
      cpos = @codewave.editor.getCursorPos()
      innerStart = @replacements[0].start+@codewave.brakets.length
      if @codewave.findPrevBraket(cpos.start) == @replacements[0].start and (innerEnd = @codewave.findNextBraket(innerStart))? and innerEnd >= cpos.end
        @_typed = @codewave.editor.textSubstr(innerStart, innerEnd)
      else
        @_typed = false
    return @_typed
  whithinOpenBounds: (pos) ->
    for repl, i in @replacements
      targetPos = @startPosAt(i)
      targetText = @codewave.brakets + @typed() + @codewave.brakets
      if targetPos.innerContainsPos(pos) && targetPos.textFromEditor(@codewave.editor) == targetText
        return targetPos
    return false
  whithinCloseBounds: (pos) ->
    for repl, i in @replacements
      targetPos = @endPosAt(i)
      targetText = @codewave.brakets + @codewave.closeChar + @typed() + @codewave.brakets
      if targetPos.innerContainsPos(pos) && targetPos.textFromEditor(@codewave.editor) == targetText
        return targetPos
    return false
  startPosAt: (index) ->
    return new Codewave.util.Pos(
        @replacements[index].selections[0].start + @typed().length * (index*2),
        @replacements[index].selections[0].end + @typed().length * (index*2 +1)
      ).wrappedBy(@codewave.brakets,@codewave.brakets)
  endPosAt: (index) ->
    return new Codewave.util.Pos(
        @replacements[index].selections[1].start + @typed().length * (index*2 +1),
        @replacements[index].selections[1].end + @typed().length * (index*2 +2)
      ).wrappedBy(@codewave.brakets+@codewave.closeChar,@codewave.brakets)

class @Codewave.SimulatedClosingPromp extends Codewave.ClosingPromp
  continue: ->
    @simulateType()
  simulateType: ->
    clearTimeout(@timeout) if @timeout?
    @timeout = setTimeout (=>
      @invalidTyped()
      targetText = @codewave.brakets + @codewave.closeChar + @typed() + @codewave.brakets
      curClose = @whithinCloseBounds(@replacements[0].selections[1].copy().applyOffset(@typed().length))
      if curClose
        repl = new Codewave.util.Replacement(curClose.start,curClose.end,targetText)
        if repl.necessaryFor(@codewave.editor)
          @codewave.editor.applyReplacements([repl])
      else
        @stop()
    ), 2
  skipEvent: ->
    return false
  getSelections: ->
    return [
        @codewave.editor.getCursorPos()
        @replacements[0].selections[1] + @typed().length
      ]
  whithinCloseBounds: (pos) ->
    for repl, i in @replacements
      targetPos = @endPosAt(i)
      next = @codewave.findNextBraket(targetPos.innerStart)
      if next?
        targetPos.moveSuffix(next)
        if targetPos.innerContainsPos(pos)
          return targetPos
    return false

@Codewave.ClosingPromp.newFor = (codewave,selections) ->
  if codewave.editor.allowMultiSelection()
    return new Codewave.ClosingPromp(codewave,selections)
  else
    return new Codewave.SimulatedClosingPromp(codewave,selections)