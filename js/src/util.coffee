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

@Codewave.util = ( 
  splitFirstNamespace: (fullname) ->
    if s.indexOf(":") == -1
      return [null,fullname]
    parts = fullname.split(':')
    [parts.shift(),parts.join(':')]

  splitNamespace: (fullname) ->
    if s.indexOf(":") == -1
      return [null,fullname]
    parts = fullname.split(':')
    name = parts.pop()
    [parts.join(':'),name]

  trimEmptyLine: (txt) ->
    return txt.replace(/^\r?\n/, '').sub(/\r?\n$/, '')

  escapeRegExp: (str) ->
    str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")

  repeatToLength: (txt, length) ->
    Array(Math.ceil(length/txt.length)+1).join(txt).substring(0,length)

  getTxtSize: (txt) ->
    lines = txt.replace(/\r/g,'').split("\n")
    w = 0
    for l in lines
      w = Math.max(w,l.length)
    return new Size(w,lines.length)

  StrPos: StrPos
  Pos: Pos
  WrappedPos: WrappedPos
  Size: Size
    
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
