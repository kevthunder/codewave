# [pawa python]
#   replace (Editor) (editor.Editor)
#   replace @text()  self.text

class @Codewave.TextParser extends @Codewave.Editor
  constructor: (@_text) ->
    self.namespace = 'text_parser'
  text: (val) ->
    @_text = val if val?
    @_text
  textCharAt: (pos) ->
    return @text()[pos]
  textLen: (pos) ->
    return @text().length
  textSubstr: (start, end) ->
    return @text().substring(start, end)
  insertTextAt: (text, pos) ->
    @text(@text().substring(0, pos)+text+@text().substring(pos,@text().length))
  spliceText: (start, end, text) ->
    @text(@text().slice(0, start) + (text || "") + @text().slice(end))
  getCursorPos: ->
    return @target
  setCursorPos: (start, end) ->
    end = start if arguments.length < 2
    @target = (
        start: end
        end: end
      )