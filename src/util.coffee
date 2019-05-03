# [pawa python]
#   replace Codewave.util. ''

class StrPos
  constructor: (@pos,@str) ->
  end: ->
    @pos + @str.length

class Pos
  constructor: (@start,@end) ->
    @end = @start unless @end?
  containsPt: (pt) ->
    return @start <= pt and pt <= @end
  containsPos: (pos) ->
    return @start <= pos.start and pos.end <= @end
  wrappedBy: (prefix,suffix) ->
    return new WrappedPos(@start-prefix.length,@start,@end,@end+suffix.length)
  withEditor: (val)->
    @_editor = val
    return this
  editor: ->
    unless @_editor?
      throw new Error('No editor set')
    return @_editor
  hasEditor: ->
    return @_editor?
  text: ->
    @editor().textSubstr(@start, @end)
  applyOffset: (offset)->
    if offset != 0
      @start += offset
      @end += offset
    return this
  prevEOL: ->
    unless @_prevEOL?
      @_prevEOL = @editor().findLineStart(@start)
    return @_prevEOL
  nextEOL: ->
    unless @_nextEOL?
      @_nextEOL = @editor().findLineEnd(@end)
    return @_nextEOL
  textWithFullLines: ->
    unless @_textWithFullLines?
      @_textWithFullLines = @editor().textSubstr(@prevEOL(),@nextEOL())
    return @_textWithFullLines
  sameLinesPrefix: ->
    unless @_sameLinesPrefix?
      @_sameLinesPrefix = @editor().textSubstr(@prevEOL(),@start)
    return @_sameLinesPrefix
  sameLinesSuffix: ->
    unless @_sameLinesSuffix?
      @_sameLinesSuffix = @editor().textSubstr(@end,@nextEOL())
    return @_sameLinesSuffix
  copy: ->
    res = new Pos(@start,@end)
    if @hasEditor()
      res.withEditor(@editor())
    return res
  raw: ->
    [@start,@end]
    
class WrappedPos extends Pos
  constructor: (@start,@innerStart,@innerEnd,@end) ->
    super()
  innerContainsPt: (pt) ->
    return @innerStart <= pt and pt <= @innerEnd
  innerContainsPos: (pos) ->
    return @innerStart <= pos.start and pos.end <= @innerEnd
  innerText: ->
    @editor().textSubstr(@innerStart, @innerEnd)
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
    
class OptionObject
  setOpts: (options,defaults)->
    @defaults = defaults
    for key, val of @defaults
      if key of options
        @setOpt(key,options[key])
      else
        @setOpt(key,val)
        
  setOpt: (key, val)->
    if this[key]?.call?
      this[key](val)
    else
      this[key]= val
        
  getOpt: (key)->
    if this[key]?.call?
      return this[key]()
    else
      return this[key]
  
  getOpts: ->
    opts = {}
    for key, val of @defaults
      opts[key] = @getOpt(key)
    return opts

# class Proxy
  # target: (val)->
    # if val?
      # @_target = val
      # for name, funct of @_target.prototype
        # unless this[name]?
          # this[name] = ->
            # @_target[name].call(@_target,arguments)
    # return @_target

AddModule = (self,module) ->
  throw('AddModule requires module') unless module
  for key, value of module.prototype
      self::[key] = value
  
class Replacement extends Pos
  AddModule(this,OptionObject)
  constructor: (@start, @end, @text, @options = {}) ->
    super()
    @setOpts(@options)
  setOpts: (options) ->
    OptionObject.prototype.setOpts.call(this,options,{
      prefix: ''
      suffix: ''
      selections: []
    })
  resPosBeforePrefix: ->
    return @start+@prefix.length+@text.length
  resEnd: -> 
    return @start+@finalText().length
  apply: ->
    @editor().spliceText(@start, @end, @finalText())
  necessary: ->
    return @finalText() != @originalText()
  originalText: ->
    return @editor().textSubstr(@start, @end)
  finalText: ->
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
    res = new Replacement(@start, @end, @text, @getOpts())
    if @hasEditor()
      res.withEditor(@editor())
    res.selections = @selections.map( (s)->s.copy() )
    return res

class Wrapping extends Replacement
  constructor: (@start, @end, prefix ='', suffix = '', @options = {}) ->
    super()
    @setOpts(@options)
    @text = ''
    @prefix = prefix
    @suffix = suffix
  apply: ->
    @adjustSel()
    super()
  adjustSel: ->
    offset = @originalText().length
    for sel in @selections
      if sel.start > @start+@prefix.length
        sel.start += offset
      if sel.end >= @start+@prefix.length
        sel.end += offset
  finalText: ->
    if @hasEditor()
      text = @originalText()
    else
      text = ''
    return @prefix+text+@suffix
  offsetAfter: () -> 
    return @prefix.length+@suffix.length
          
  copy: -> 
    res = new Wrapping(@start, @end, @prefix, @suffix)
    res.selections = @selections.map( (s)->s.copy() )
    return res

class PairMatch
  constructor: (@pair,@match,@offset = 0) ->
  name: ->
    if @match
      unless _name?
        for group, i in @match
          if i > 0 and group?
            _name = @pair.matchAnyPartKeys()[i-1]
            return _name
        _name = false
      return _name || null
  start: ->
    @match.index + @offset
  end: ->
    @match.index + @match[0].length + @offset
  valid: ->
    return !@pair.validMatch || @pair.validMatch(this)
  length: ->
    @match[0].length
class Pair
  constructor: (@opener,@closer,@options = {}) ->
    defaults = {
      optionnal_end: false
      validMatch: null
    }
    for key, val of defaults
      if key of @options
        this[key] = @options[key]
      else
        this[key] = val
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
  matchAny: (text,offset=0) ->
    while (match = @_matchAny(text,offset))? and !match.valid()
      offset = match.end()
    return match if match? and match.valid()
  _matchAny: (text,offset=0) ->
    if offset
      text = text.substr(offset)
    match = @matchAnyReg().exec(text)
    if match?
      return new PairMatch(this,match,offset)
  matchAnyNamed: (text) ->
    return @_matchAnyGetName(@matchAny(text))
  matchAnyLast: (text,offset=0) ->
    while match = @matchAny(text,offset)
      offset = match.end()
      if !res or res.end() != match.end()
        res = match
    return res
  identical: ->
    @opener == @closer or (
      @opener.source? and 
      @closer.source? and 
      @opener.source == @closer.source
    )
  wrapperPos: (pos,text) ->
    start = @matchAnyLast(text.substr(0,pos.start))
    if start? and (@identical() or start.name() == 'opener')
      end = @matchAny(text,pos.end)
      if end? and (@identical() or end.name() == 'closer')
        return new Codewave.util.Pos(start.start(),end.end())
      else if @optionnal_end
        return new Codewave.util.Pos(start.start(),text.length)
  isWapperOf: (pos,text) ->
    return @wrapperPos(pos,text)?
    

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
    
  repeat: (txt, nb) ->
    Array(nb+1).join(txt)
    
  getTxtSize: (txt) ->
    lines = txt.replace(/\r/g,'').split("\n")  # [pawa python] replace '/\r/g' "'\r'"
    w = 0
    for l in lines
      w = Math.max(w,l.length)
    return new Size(w,lines.length-1)

  indentNotFirst: (text,nb=1,spaces='  ') ->
    if text?
      reg = /\n/g  # [pawa python] replace '/\n/g' "re.compile(r'\n',re.M)"
      return text.replace(reg, "\n" + Codewave.util.repeat(spaces, nb))
    else
      return text
      
  indent: (text,nb=1,spaces='  ') ->
    if text?
      return spaces + Codewave.util.indentNotFirst(text,nb,spaces)
    else
      return text
  
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
  Wrapping: Wrapping
    
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
