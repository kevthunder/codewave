class @Codewave.TextParser
  constructor: (@_text) ->
  text: (val) ->
    @_text = val if val?
    @_text
  textCharAt: (pos) ->
    @text()[pos]
  textLen: (pos) ->
    @text().length
  textSubstr: (start, end) ->
    @text().substring(start, end)
  insertTextAt: (text, pos) ->
    @text(@text().substring(0, pos)+text+@text().substring(pos,@text().length))
  spliceText: (start, end, text) ->
    @text(@text().slice(0, start) + (text || "") + @text().slice(end))