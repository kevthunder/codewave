class @Codewave.util.BoxHelper
  constructor: (@codewave, options = {}) ->
    defaults = {
      deco: codewave.deco
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
    @codewave.wrapComment(str)
  separator: ->
    len = @width + 2 * @pad + 2 * @deco.length
    @wrapComment(@decoLine(len))
  startSep: ->
    ln = @width + 2 * @pad + 2 * @deco.length - @openText.length
    @wrapComment(@openText+@decoLine(ln))
  endSep: ->
    ln = @width + 2 * @pad + 2 * @deco.length - @closeText.length
    @wrapComment(@closeText+@decoLine(ln))
  decoLine: (len) ->
    return Codewave.util.repeatToLength(@deco, len)
  padding: -> 
    return Codewave.util.repeatToLength(" ", @pad)
  lines: (text = '',toHeight=true) ->
    text = text or ''
    lines = text.replace(/\r/g, '').split("\n")
    if toHeight
      return (@line(lines[x] or '') for x in [0..@height]).join('\n') 
    else
      return (@line(l) for l in lines).join('\n') 
  line: (text = '') ->
    Codewave.util.repeatToLength(" ",@indent) +
    @wrapComment(
      @deco +
      @padding() +
      text +
      Codewave.util.repeatToLength(" ", @width - @removeIgnoredContent(text).length) + 
      @padding() +
      @deco
    )
  removeIgnoredContent: (text) ->
    console.log(text,@codewave.removeMarkers(text))
    @codewave.removeMarkers(@codewave.removeCarret(text))
  textBounds: (text) ->
    Codewave.util.getTxtSize(@removeIgnoredContent(text))
  getBoxForPos: (pos) ->
    startFind = @codewave.wrapCommentLeft(@deco + @deco)
    endFind = @codewave.wrapCommentRight(@deco + @deco)
    start = @codewave.findPrev(pos.start, startFind)
    end = @codewave.findNext(pos.end, endFind)
    if start? and end?
      new Codewave.util.Pos(start,end + endFind.length)
  getOptFromLine: (line,getPad=true) ->
    rStart = new RegExp("(\\s*)("+@codewave.wrapCommentLeft(@deco)+")(\\s*)")
    rEnd = new RegExp("(\\s*)("+@codewave.wrapCommentRight(@deco)+")")
    resStart = rStart.exec(line)
    resEnd = rEnd.exec(line)
    if getPad
      @pad = Math.min(resStart[3].length,resEnd[1].length)
    @indent = resStart[1].length
    startPos = resStart.index + resStart[1].length + resStart[2].length + @pad
    endPos = resEnd.index + resEnd[1].length - @pad
    @width = endPos - startPos
    this
  reformatLines: (text) ->
    @lines(@removeComment(text),false)
  removeComment: (text)->
    if text?
      ecl = Codewave.util.escapeRegExp(@codewave.wrapCommentLeft())
      ecr = Codewave.util.escapeRegExp(@codewave.wrapCommentRight())
      ed = Codewave.util.escapeRegExp(@deco)
      re1 = new RegExp("^\\s*#{ecl}(?:#{ed})*\\s{0,#{@pad}}",'gm')
      re2 = new RegExp("\\s*(?:#{ed})*#{ecr}\\s*$",'gm')
      text = text.replace(re1,'').replace(re2,'')
   
  