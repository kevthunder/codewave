class @Codewave.ClosingPromp
  constructor: (@codewave,selections) ->
    @timeout = null
    @selections = Codewave.util.posCollection(selections)
  begin: ->
    @typed = ''
    @replacements = @selections.wrap(
      @codewave.brakets+@codewave.carretChar+@codewave.brakets+"\n",
      "\n"+@codewave.brakets+@codewave.closeChar+@codewave.carretChar+@codewave.brakets
    ).map( (p) -> p.carretToSel() )
    @codewave.editor.applyReplacements(@replacements)
    
    if @codewave.editor.canListenToChange()
      @codewave.editor.addChangeListener( (ch=null)=> @onChange(ch) )
    
    return this
  onChange: (ch = null)->
		if !ch? or ch.charCodeAt(0) == 32
			if self.shouldStop()
				self.stop()
				self.cleanClose()
        
	shouldStop: ->
    cpos = @codewave.editor.getCursorPos()
    return !whithinOpenFirstBounds()? or @typed.indexOf(' ') != -1
  
        
        
    # clearTimeout(@timeout) if @timeout?
    # @timeout = setTimeout (=>
      # cpos = @codewave.editor.getCursorPos()
      # if (openBounds = @whithinOpenBounds(cpos.end))?
        # cmd = @codewave.editor.textSubstr(openBounds.innerStart,openBounds.innerEnd).split(' ')[0]
        # if (closeBounds = @whithinCloseBounds(openBounds))? and @codewave.editor.textSubstr(closeBounds.innerStart,closeBounds.innerEnd) != cmd
          # @codewave.editor.spliceText(closeBounds.innerStart,closeBounds.innerEnd,cmd)
          # @codewave.editor.setCursorPos(cpos.start,cpos.end)
      # else
        # @stop()
    # ), 2
  stop: ->
    clearTimeout(@timeout) if @timeout?
    @codewave.editor.onAnyChange = null
    @codewave.closingPromp = null if @codewave.closingPromp == this
  cancel: ->
    if (openBounds = @whithinOpenBounds(@start+@codewave.brakets.length))? and (closeBounds = @whithinCloseBounds(openBounds))?
      @codewave.editor.spliceText(closeBounds.start-1,closeBounds.end,'')
      @codewave.editor.spliceText(openBounds.start,openBounds.end+1,'')
      @codewave.editor.setCursorPos(@start,@end)
    @stop()
  whithinOpenFirstBounds: (pos) ->
    innerStart = @replacements[0].start+@codewave.brakets.length
    if @codewave.findPrevBraket(pos) == @replacements[0].start and (innerEnd = @codewave.findNextBraket(innerStart))?
      @typed = editor.textSubstr(innerStart,innerEnd)
  whithinCloseBounds: (openBounds) ->
    start = openBounds.end+@len+2
    innerStart = start+@codewave.brakets.length+@codewave.closeChar.length
    if @codewave.editor.textSubstr(start,innerStart) == @codewave.brakets+@codewave.closeChar and (innerEnd = @codewave.findNextBraket(innerStart))?
      ( start: start, innerStart:innerStart, innerEnd:innerEnd, end: innerEnd+@codewave.brakets.length)