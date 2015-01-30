@Codewave.cmd = (
  hello: "Hello, World!",
  box: class
    constructor: (@instance)->
      if @instance.content
        [@width,@height] = @textBounds(@instance.content)
      else
        @width = 50
        @height = 3
      
      @width = if @instance.params.length > 1
        parseInt(@instance.params[0])
      else if @instance.named.width?
        @instance.named.width
      else
        @width
        
      @height = if @instance.params.length > 1
        parseInt(@instance.params[1])
      else if @instance.params.length > 0
        parseInt(@instance.params[0])
      else if @instance.named.height?
        @instance.named.height
      else
        @height
        
      @commentChar = @instance.codewave.getCommentChar()
      @deco = @instance.codewave.deco
      @pad = 2
    result: ->
      lines = (@instance.content or '').split("\n")
      content = @separator() + "\n" + (@line(lines[x]) for x in [0..(@height-1)]).join("\n") + "\n"+ @separator()
    wrapComment: (str)->
      if @commentChar.indexOf('%s') > -1
        @commentChar.replace('%s',str)
      else
        @commentChar + ' ' + str + ' ' + @commentChar
    separator: ->
      len = @width + 2 * @pad + 2 * @deco.length
      @wrapComment(Array(Math.ceil(len/@deco.length)+1).join(@deco).substring(0,len))
    padding: -> 
      Array(@pad+1).join(" ")
    line: (text = '') ->
      @wrapComment(@deco + @padding() + text + Array(@width-text.length+1).join(" ") + @padding()+ @deco)
    textBounds: (text) ->
      lines = text.split("\n")
      w = 0
      for l in lines
        w = Math.max(w,l.length)
      [w,lines.length]
  close: class
    constructor: (@instance)->
      @commentChar = @instance.codewave.getCommentChar()
      @deco = @instance.codewave.deco
    startFind: ->
      if (i = @commentChar.indexOf('%s')) > -1
        @commentChar.substr(0,i) + @deco + @deco
      else
        @commentChar + ' ' + @deco + @deco
    endFind: ->
      if (i = @commentChar.indexOf('%s')) > -1
        @deco + @deco + @commentChar.substr(i+2)
      else
        @deco + @deco + ' ' + @commentChar
    execute: ->
      startFind = @startFind()
      endFind = @endFind()
      start = @instance.codewave.findPrev(@instance.pos, startFind)
      end = @instance.codewave.findNext(@instance.getEndPos(), endFind) + endFind.length
      console.log([startFind,endFind])
      console.log([start,end])
      if start? and end?
        @instance.codewave.editor.spliceText(start,end,'')
        @instance.codewave.editor.setCursorPos(start)
      else
        @instance.replaceWith('')
        
  edit: class
    constructor: (@instance)->
      @cmd = @instance.getParam([0,'cmd'])
      @content = @instance.content
    result: ->
      if @cmd
        if @content
          @resultWithContent()
        else
          @resultWithoutContent()
    resultWithContent: ->
    resultWithoutContent: ->
      """
      ~~box~~
      ~~source~~
      ~~/source~~
      ~~save~~ ~~close~~
      ~~/box~~
      """
)