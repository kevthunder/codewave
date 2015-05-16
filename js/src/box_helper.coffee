# [pawa]
#   replace 'replace(/\r/g' "replace('\r'"

class @Codewave.util.BoxHelper
  constructor: (@context, options = {}) ->
    @defaults = {
      deco: @context.codewave.deco
      pad: 2
      width: 50
      height: 3
      openText: ''
      closeText: ''
      prefix: ''
      suffix: ''
      indent: 0
    }
    for key, val of @defaults
      if key of options
        this[key] = options[key]
      else
        this[key] = val
  clone: (text) ->
    opt = {}
    for key, val of @defaults
      opt[key] = this[key]
    return new Codewave.util.BoxHelper(@context,opt)
  draw: (text) ->
    return @startSep() + "\n" + @lines(text) + "\n"+ @endSep()
  wrapComment: (str) ->
    return @context.wrapComment(str)
  separator: ->
    len = @width + 2 * @pad + 2 * @deco.length
    return @wrapComment(@decoLine(len))
  startSep: ->
    ln = @width + 2 * @pad + 2 * @deco.length - @openText.length
    return @prefix + @wrapComment(@openText+@decoLine(ln))
  endSep: ->
    ln = @width + 2 * @pad + 2 * @deco.length - @closeText.length
    return @wrapComment(@closeText+@decoLine(ln)) + @suffix
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
  left: ->
    @context.wrapCommentLeft(@deco + @padding())
  right: ->
    @context.wrapCommentRight(@padding() + @deco)
  removeIgnoredContent: (text) ->
    return @context.codewave.removeMarkers(@context.codewave.removeCarret(text))
  textBounds: (text) ->
    return Codewave.util.getTxtSize(@removeIgnoredContent(text))
  getBoxForPos: (pos) ->
    depth = @getNestedLvl(pos.start)
    if depth > 0
      left = @left()
      curLeft = Codewave.util.repeat(left,depth-1)
      
      clone = @clone()
      placeholder = "###PlaceHolder###"
      clone.width = placeholder.length
      clone.openText = clone.closeText = @deco + @deco + placeholder + @deco + @deco
      
      startFind = RegExp(Codewave.util.escapeRegExp(curLeft + clone.startSep()).replace(placeholder,'.*'))
      endFind = RegExp(Codewave.util.escapeRegExp(curLeft + clone.endSep()).replace(placeholder,'.*'))
      
      pair = new Codewave.util.Pair(startFind,endFind,{
        validMatch: (match)=>
          # console.log(match,left)
          f = @context.codewave.findAnyNext(match.start() ,[left,"\n","\r"],-1)
          return !f? or f.str != left
      })
      res = pair.wrapperPos(pos,@context.codewave.editor.text())
      if res?
        res.start += curLeft.length
        return res
    
  getNestedLvl: (index) ->
    depth = 0
    left = @left()
    while (f = @context.codewave.findAnyNext(index ,[left,"\n","\r"],-1))? && f.str == left
      index = f.pos
      depth++
    return depth
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
   
  