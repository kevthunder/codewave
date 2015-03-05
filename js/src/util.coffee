class StrPos
  constructor: (@pos,@str) ->
    #
  end: ->
    @pos + @str.length

class Pos
  constructor: (@start,@end) ->
    #
  containsPt: (pt) ->
    return @start <= pt and pt <= @end
  containsPos: (pos) ->
    return @start <= pos.start and pos.end <= @end
class WrappedPos extends Pos
  constructor: (@start,@innerStart,@innerEnd,@end) ->
    #
  innerContainsPt: (pt) ->
    return @innerStart <= pt and pt <= @innerEnd
  innerContainsPos: (pos) ->
    return @innerStart <= pos.start and pos.end <= @innerEnd

class Size
  constructor: (@width,@height) ->
    #
    
class Pair
  constructor: (@opener,@closer,@options) ->
    #
  openerReg: ->
    if typeof @opener == 'string' 
      new RegExp(Codewave.util.escapeRegExp(@opener))
    else
      @opener
  closerReg: ->
    if typeof @closer == 'string' 
      new RegExp(Codewave.util.escapeRegExp(@closer))
    else
      @closer
  matchAnyParts: ->
    {
      opener: @openerReg()
      closer: @closerReg()
    }
  matchAnyPartKeys: ->
    keys = []
    for key, reg of @matchAnyParts()
      keys.push(key)
    keys
  matchAnyReg: ->
    groups = []
    for key, reg of @matchAnyParts()
      groups.push('('+reg.source+')')
    new RegExp(groups.join('|'))
  matchAny: (text) ->
    @matchAnyReg().exec(text)
  matchAnyNamed: (text) ->
    @_matchAnyGetName(@matchAny(text))
  _matchAnyGetName: (match) ->
    if match
      for group, i in match
        if i > 0 and group?
          return @matchAnyPartKeys()[i-1]
      null
  matchAnyLast: (text) ->
    ctext = text
    while match = @matchAny(ctext)
      ctext = ctext.substr(match.index+1)
      res = match
    res
  matchAnyLastNamed: (text) ->
    @_matchAnyGetName(@matchAnyLast(text))
  isWapperOf: (pos,text) ->
    @matchAnyNamed(text.substr(pos.end)) == 'closer' and @matchAnyLastNamed(text.substr(0,pos.start)) == 'opener'
    

@Codewave.util = ( 
  splitFirstNamespace: (fullname,isSpace = false) ->
    if fullname.indexOf(":") == -1 and !isSpace
      return [null,fullname]
    parts = fullname.split(':')
    [parts.shift(),parts.join(':') || null]

  splitNamespace: (fullname) ->
    if fullname.indexOf(":") == -1
      return [null,fullname]
    parts = fullname.split(':')
    name = parts.pop()
    [parts.join(':'),name]

  trimEmptyLine: (txt) ->
    return txt.replace(/^\r?\n/, '').replace(/\r?\n$/, '')

  escapeRegExp: (str) ->
    str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")

  repeatToLength: (txt, length) ->
    Array(Math.ceil(length/txt.length)+1).join(txt).substring(0,length)

  getTxtSize: (txt) ->
    lines = txt.replace(/\r/g,'').split("\n")
    w = 0
    for l in lines
      w = Math.max(w,l.length)
    return new Size(w,lines.length-1)

  StrPos: StrPos
  Pos: Pos
  WrappedPos: WrappedPos
  Size: Size
  Pair: Pair
    
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
