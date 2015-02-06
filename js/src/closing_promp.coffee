class @Codewave.ClosingPromp
  constructor: (@codewave,@start,@end) ->
    @timeout = null
    @len = @end - @start
    @codewave.editor.insertTextAt("\n"+@codewave.brakets+@codewave.closeChar+@codewave.brakets,@end)
    @codewave.editor.insertTextAt(@codewave.brakets+@codewave.brakets+"\n",@start)
    @codewave.editor.setCursorPos(@start+@codewave.brakets.length)
    @codewave.editor.onAnyChange = => @onAnyChange()
  onAnyChange: ->
    clearTimeout(@timeout) if @timeout?
    @timeout = setTimeout (=>
      cpos = @codewave.editor.getCursorPos()
      if (openBounds = @whithinOpenBounds(cpos.end))?
        cmd = @codewave.editor.textSubstr(openBounds.innerStart,openBounds.innerEnd).split(' ')[0]
        if (closeBounds = @whithinCloseBounds(openBounds))? and @codewave.editor.textSubstr(closeBounds.innerStart,closeBounds.innerEnd) != cmd
          @codewave.editor.spliceText(closeBounds.innerStart,closeBounds.innerEnd,cmd)
          @codewave.editor.setCursorPos(cpos.start,cpos.end)
      else
        @stop()
    ), 2
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
  whithinOpenBounds: (pos) ->
    innerStart = @start+@codewave.brakets.length
    if @codewave.findPrevBraket(pos) == @start and @codewave.editor.textSubstr(@start,innerStart) == @codewave.brakets and (innerEnd = @codewave.findNextBraket(innerStart))?
      ( start: @start, innerStart:innerStart, innerEnd:innerEnd, end: innerEnd+@codewave.brakets.length)
  whithinCloseBounds: (openBounds) ->
    start = openBounds.end+@len+2
    innerStart = start+@codewave.brakets.length+@codewave.closeChar.length
    if @codewave.editor.textSubstr(start,innerStart) == @codewave.brakets+@codewave.closeChar and (innerEnd = @codewave.findNextBraket(innerStart))?
      ( start: start, innerStart:innerStart, innerEnd:innerEnd, end: innerEnd+@codewave.brakets.length)