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
class WrappedPos extends Pos
  constructor: (@start,@innerStart,@innerEnd,@end) ->
  innerContainsPt: (pt) ->
    return @innerStart <= pt and pt <= @innerEnd
  innerContainsPos: (pos) ->
    return @innerStart <= pos.start and pos.end <= @innerEnd

class Size
  constructor: (@width,@height) ->
    
class Replacement
  constructor: (@start, @end, @text, @prefix ='', @suffix = '') ->
  resPosBeforePrefix: ->
    return @start+@prefix.length+@text.length
  resEnd: -> 
    return @start+@prefix.length+@text.length+@suffix.length
  applyToEditor: (editor) ->
    editor.spliceText(@start,@end,@prefix+@text+@suffix)
    
    
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
