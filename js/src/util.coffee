# [pawa python]
#   replace Codewave.util. ''

class StrPos
  constructor: (@pos,@str) ->
  end: ->
    @pos + @str.length

class Pos
  constructor: (@start,@end) ->
  containsPt: (pt) ->
    return @start <= pt and pt <= @end
  containsPos: (pos) ->
    return @start <= pos.start and pos.end <= @end
  wrappedBy: (prefix,suffix) ->
    return new WrappedPos(@start-prefix.length,@start,@end,@end+suffix.length)
  textFromEditor: (editor) ->
    editor.textSubstr(@start, @end)
  applyOffset: (offset)->
    if offset != 0
      @start += offset
      @end += offset
    return this
  copy: ->
    return new Pos(@start,@end)
    
class WrappedPos extends Pos
  constructor: (@start,@innerStart,@innerEnd,@end) ->
  innerContainsPt: (pt) ->
    return @innerStart <= pt and pt <= @innerEnd
  innerContainsPos: (pos) ->
    return @innerStart <= pos.start and pos.end <= @innerEnd
  innerTextFromEditor: (editor) ->
    editor.textSubstr(@innerStart, @innerEnd)
  setInnerLen: (len) ->
    @moveSufix(@innerStart + len)
  moveSuffix: (pt) ->
    suffixLen = @end - @innerEnd
    @innerEnd = pt
    @end = @innerEnd + suffixLen
  copy: ->
    return new WrappedPos(@start,@innerStart,@innerEnd,@end)

class Size
  constructor: (@width,@height) ->
    
class Replacement
  constructor: (@start, @end, @text, @prefix ='', @suffix = '') ->
    @selections = []
  resPosBeforePrefix: ->
    return @start+@prefix.length+@text.length
  resEnd: (editor = null) -> 
    return @start+@finalText(editor).length
  applyToEditor: (editor) ->
    editor.spliceText(@start, @end, @finalText(editor))
  necessaryFor: (editor) ->
    return @finalText(editor) != editor.textSubstr(@start, @end)
  originalTextWith: (editor) ->
    editor.textSubstr(@start, @end)
  finalText: (editor = null) ->
    return @prefix+@text+@suffix
  offsetAfter: () -> 
    return @finalText().length - (@end - @start)
  applyOffset: (offset)->
    if offset != 0
      @start += offset
      @end += offset
      for sel in @selections
        sel.start += offset
        sel.end += offset
    return this
  selectContent: -> 
    @selections = [new Pos(@prefix.length+@start, @prefix.length+@start+@text.length)]
    return this
  carretToSel: ->
    @selections = []
    text = @finalText()
    @prefix = Codewave.util.removeCarret(@prefix)
    @text = Codewave.util.removeCarret(@text)
    @suffix = Codewave.util.removeCarret(@suffix)
    start = @start
    
    while (res = Codewave.util.getAndRemoveFirstCarret(text))?
      [pos,text] = res
      @selections.push(new Pos(start+pos, start+pos))
      
    return this
  copy: -> 
    res = new Replacement(@start, @end, @text, @prefix, @suffix)
    res.selections = @selections.map( (s)->s.copy() )
    return res
    
class Wrapping extends Replacement
  constructor: (@start, @end, @prefix ='', @suffix = '') ->
    @text = ''
    @selections = []
  applyToEditor: (editor) ->
    @adjustSelFor(editor)
    super(editor)
  adjustSelFor: (editor) ->
    offset = @originalTextWith(editor).length
    for sel in @selections
      if sel.start > @start+@prefix.length
        sel.start += offset
      if sel.end >= @start+@prefix.length
        sel.end += offset
  finalText: (editor = null) ->
    if editor?
      text = @originalTextWith(editor)
    else
      text = ''
    return @prefix+text+@suffix
  offsetAfter: () -> 
    return @prefix.length+@suffix.length
          
  copy: -> 
    res = new Wrapping(@start, @end, @prefix, @suffix)
    res.selections = @selections.map( (s)->s.copy() )
    return res
    
class Pair
  constructor: (@opener,@closer,@options = {}) ->
  openerReg: ->
    if typeof @opener == 'string' 
      return new RegExp(Codewave.util.escapeRegExp(@opener))
    else
      return @opener
  closerReg: ->
    if typeof @closer == 'string' 
      return new RegExp(Codewave.util.escapeRegExp(@closer))
    else
      return @closer
  matchAnyParts: ->
    return {
      opener: @openerReg()
      closer: @closerReg()
    }
  matchAnyPartKeys: ->
    keys = []
    for key, reg of @matchAnyParts()
      keys.push(key)
    return keys
  matchAnyReg: ->
    groups = []
    for key, reg of @matchAnyParts()
      groups.push('('+reg.source+')')  # [pawa python] replace reg.source reg.pattern
    return new RegExp(groups.join('|'))
  matchAny: (text) ->
    return @matchAnyReg().exec(text)
  matchAnyNamed: (text) ->
    return @_matchAnyGetName(@matchAny(text))
  _matchAnyGetName: (match) ->
    if match
      for group, i in match
        if i > 0 and group?
          return @matchAnyPartKeys()[i-1]
      return null
  matchAnyLast: (text) ->
    ctext = text
    while match = @matchAny(ctext)
      ctext = ctext.substr(match.index+1)   # [pawa python] replace match.index match.start()
      res = match
    return res
  matchAnyLastNamed: (text) ->
    return @_matchAnyGetName(@matchAnyLast(text))
  isWapperOf: (pos,text) ->
    return @matchAnyNamed(text.substr(pos.end)) == 'closer' and @matchAnyLastNamed(text.substr(0,pos.start)) == 'opener'
    

@Codewave.util = ( 
  splitFirstNamespace: (fullname,isSpace = false) ->
    if fullname.indexOf(":") == -1 and !isSpace
      return [null,fullname]
    parts = fullname.split(':')
    return [parts.shift(),parts.join(':') || null]

  splitNamespace: (fullname) ->
    if fullname.indexOf(":") == -1
      return [null,fullname]
    parts = fullname.split(':')
    name = parts.pop()
    [parts.join(':'),name]

  trimEmptyLine: (txt) ->
    return txt.replace(/^\s*\r?\n/, '').replace(/\r?\n\s*$/, '')

  escapeRegExp: (str) ->
    str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")

  repeatToLength: (txt, length) ->
    return '' if length <= 0
    Array(Math.ceil(length/txt.length)+1).join(txt).substring(0,length)

  getTxtSize: (txt) ->
    lines = txt.replace(/\r/g,'').split("\n")  # [pawa python] replace '/\r/g' "'\r'"
    w = 0
    for l in lines
      w = Math.max(w,l.length)
    return new Size(w,lines.length-1)

  reverseStr: (txt) ->
    return txt.split("").reverse().join("")
  
  
  removeCarret: (txt, carretChar = '|') ->
    tmp = '[[[[quoted_carret]]]]'
    reCarret = new RegExp(Codewave.util.escapeRegExp(carretChar), "g")
    reQuoted = new RegExp(Codewave.util.escapeRegExp(carretChar+carretChar), "g")
    reTmp = new RegExp(Codewave.util.escapeRegExp(tmp), "g")
    txt.replace(reQuoted,tmp).replace(reCarret,'').replace(reTmp, carretChar)
    
  getAndRemoveFirstCarret: (txt, carretChar = '|') ->
    pos = Codewave.util.getCarretPos(txt,carretChar)
    if pos?
      txt = txt.substr(0,pos) + txt.substr(pos+carretChar.length)
      return [pos,txt]
      
  getCarretPos: (txt, carretChar = '|') ->
    reQuoted = new RegExp(Codewave.util.escapeRegExp(carretChar+carretChar), "g")
    txt = txt.replace(reQuoted, ' ') # [pawa python] replace reQuoted carretChar+carretChar
    if (i = txt.indexOf(carretChar)) > -1
      return i
  
  isArray: (arr) ->
    return Object.prototype.toString.call( arr ) == '[object Array]'
  
  posCollection: (arr) ->
    if !Codewave.util.isArray(arr)
      arr == [arr]
    arr.wrap = (prefix,suffix)->
      return @map( (p) -> new Wrapping(p.start, p.end, prefix, suffix))
    arr.replace = (txt)->
      return @map( (p) -> new Replacement(p.start, p.end, txt))
    return arr
    
  StrPos: StrPos
  Pos: Pos
  WrappedPos: WrappedPos
  Size: Size
  Pair: Pair
  Replacement: Replacement
    
  union: (a1,a2) ->
    Codewave.util.unique(a1.concat(a2))
    
  unique: (array) ->
    a = array.concat()
    i = 0
    while i < a.length
      j = i + 1
      while j < a.length
        if a[i] == a[j]
          a.splice(j--, 1)
        ++j
      ++i
    a

    
  merge: (xs...) ->
    if xs?.length > 0
      Codewave.util.tap {}, (m) -> m[k] = v for k, v of x for x in xs
 
  tap: (o, fn) -> 
    fn(o)
    o
)
