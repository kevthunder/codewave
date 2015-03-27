# [pawa]
#   replace 'replace(/\r/g' "replace('\r'"

class @Codewave.util.BoxHelper
  constructor: (@context, options = {}) ->
    defaults = {
      deco: @context.codewave.deco
      pad: 2
      width: 50
      height: 3
      openText: ''
      closeText: ''
      indent: 0
    }
    for key, val of defaults
      if key of options
        this[key] = options[key]
      else
        this[key] = val
  draw: (text) ->
    return @startSep() + "\n" + @lines(text) + "\n"+ @endSep()
  wrapComment: (str) ->
    return @context.wrapComment(str)
  separator: ->
    len = @width + 2 * @pad + 2 * @deco.length
    return @wrapComment(@decoLine(len))
  startSep: ->
    ln = @width + 2 * @pad + 2 * @deco.length - @openText.length
    return @wrapComment(@openText+@decoLine(ln))
  endSep: ->
    ln = @width + 2 * @pad + 2 * @deco.length - @closeText.length
    return @wrapComment(@closeText+@decoLine(ln))
  decoLine: (len) ->
    return Codewave.util.repeatToLength(@deco, len)
  padding: -> 
    return Codewave.util.repeatToLength(" ", @pad)
  lines: (text = '', uptoHeight=true) ->
    text = text or ''
    lines = text.replace(/\r/g, '').split("\n")
    if uptoHeight
      return (@line(lines[x] or '') for x in [0..@height]).join('\n') 
    else
      return (@line(l) for l in lines).join('\n') 
  line: (text = '') ->
    return (Codewave.util.repeatToLength(" ",@indent) +
      @wrapComment(
        @deco +
        @padding() +
        text +
        Codewave.util.repeatToLength(" ", @width - @removeIgnoredContent(text).length) + 
        @padding() +
        @deco
      ))
  removeIgnoredContent: (text) ->
    return @context.codewave.removeMarkers(@context.codewave.removeCarret(text))
  textBounds: (text) ->
    return Codewave.util.getTxtSize(@removeIgnoredContent(text))
  getBoxForPos: (pos) ->
    startFind = @context.wrapCommentLeft(@deco + @deco)
    endFind = @context.wrapCommentRight(@deco + @deco)
    start = @context.codewave.findPrev(pos.start, startFind)
    end = @context.codewave.findNext(pos.end, endFind)
    if start? and end?
      return new Codewave.util.Pos(start,end + endFind.length)
  getOptFromLine: (line,getPad=true) ->
    rStart = new RegExp("(\\s*)("+Codewave.util.escapeRegExp(@context.wrapCommentLeft(@deco))+")(\\s*)")
    rEnd = new RegExp("(\\s*)("+Codewave.util.escapeRegExp(@context.wrapCommentRight(@deco))+")")
    resStart = rStart.exec(line)
    resEnd = rEnd.exec(line)
    if resStart? and resEnd?
      if getPad
        @pad = Math.min(resStart[3].length,resEnd[1].length)
      @indent = resStart[1].length
      startPos = resStart.index + resStart[1].length + resStart[2].length + @pad # [pawa python] replace 'resStart.index + resStart[1].length + resStart[2].length' resStart.end(2)
      endPos = resEnd.index + resEnd[1].length - @pad # [pawa python] replace 'resEnd.index + resEnd[1].length' resEnd.start(2)
      @width = endPos - startPos
    return this
  reformatLines: (text,options={}) ->
    return @lines(@removeComment(text,options),false)
  removeComment: (text,options={})->
    if text?
      defaults = {
        multiline: true
      }
      opt = Codewave.util.merge(defaults,options)
      ecl = Codewave.util.escapeRegExp(@context.wrapCommentLeft())
      ecr = Codewave.util.escapeRegExp(@context.wrapCommentRight())
      ed = Codewave.util.escapeRegExp(@deco)
      flag = if options['multiline'] then 'gm' else ''    # [pawa python] replace "'gm'" re.M
      re1 = new RegExp("^\\s*#{ecl}(?:#{ed})*\\s{0,#{@pad}}", flag)    # [pawa python] replace #{@pad} '"+str(self.pad)+"'
      re2 = new RegExp("\\s*(?:#{ed})*#{ecr}\\s*$", flag)
      return text.replace(re1,'').replace(re2,'')
   
  