setVarCmd = (name) -> 
  (
    execute: (instance) ->
      val = if (p = instance.getParam(0))?
        p
      else if instance.content
        instance.content
      instance.codewave.vars[name] = val if val?
  )
  
@Codewave.cmd.core = (
  cmd: (
    no_execute:
      result: (instance) ->
        re = new RegExp("^"+Codewave.util.escapeRegExp(instance.codewave.brakets) + Codewave.util.escapeRegExp(instance.codewave.noExecuteChar), "")
        instance.str.replace(re,instance.codewave.brakets)
    exec_parent:
      execute: (instance) ->
        instance.parent?.execute()
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
        
        @cmd = @instance.getParam(['cmd'])
        @deco = @instance.codewave.deco
        @pad = 2
      result: ->
        lines = (@instance.content or '').split("\n")
        content = @startSep() + "\n" + (@line(lines[x]) for x in [0..(@height-1)]).join("\n") + "\n"+ @endSep()
      wrapComment: (str)->
        @instance.codewave.wrapComment(str)
      separator: ->
        len = @width + 2 * @pad + 2 * @deco.length
        @wrapComment(@decoLine(len))
      startSep: ->
        cmd = ''
        if @cmd?
          cmd = @instance.codewave.brakets+@cmd+@instance.codewave.brakets
        len = @width + 2 * @pad + 2 * @deco.length - cmd.length
        @wrapComment(cmd+@decoLine(len))
      endSep: ->
        closing = ''
        if @cmd?
          closing = @instance.codewave.brakets+@instance.codewave.closeChar+@cmd.split(" ")[0]+@instance.codewave.brakets
        len = @width + 2 * @pad + 2 * @deco.length - closing.length
        @wrapComment(closing+@decoLine(len))
      decoLine: (len) ->
        Array(Math.ceil(len/@deco.length)+1).join(@deco).substring(0,len)
      padding: -> 
        Array(@pad+1).join(" ")
      line: (text = '') ->
        @wrapComment(@deco + @padding() + text + Array(@width-@instance.codewave.removeCarret(text).length+1).join(" ") + @padding()+ @deco)
      textBounds: (text) ->
        lines = @instance.codewave.removeCarret(text).split("\n")
        w = 0
        for l in lines
          w = Math.max(w,l.length)
        [w,lines.length]
    close: class
      constructor: (@instance)->
        @deco = @instance.codewave.deco
      startFind: ->
        @instance.codewave.wrapCommentLeft(@deco + @deco)
      endFind: ->
        @instance.codewave.wrapCommentRight(@deco + @deco)
      execute: ->
        startFind = @startFind()
        endFind = @endFind()
        start = @instance.codewave.findPrev(@instance.pos, startFind)
        end = @instance.codewave.findNext(@instance.getEndPos(), endFind) + endFind.length
        if start? and end?
          @instance.codewave.editor.spliceText(start,end,'')
          @instance.codewave.editor.setCursorPos(start)
        else
          @instance.replaceWith('')
          
    edit: 
      cmd: 
        source: setVarCmd('source')
        save:
          aliasOf: 'core:exec_parent'
      cls: class
        constructor: (@instance)->
          @cmdName = @instance.getParam([0,'cmd'])
          @verbalize = @instance.getParam([1]) in ['v','verbalize']
          @cmd = @instance.codewave.getCmd(@cmdName)
          @editable = @cmd.result? and typeof @cmd.result == 'string'
          @content = @instance.content
        result: ->
          if @cmd
            if @content
              @resultWithContent()
            else
              @resultWithoutContent()
        resultWithContent: ->
            parser = new Codewave(new Codewave.TextParser(@content))
            parser.addNameSpace(@instance.cmd.fullname)
            parser.parseAll()
            console.log(parser);
            Codewave.setCmd(@cmdName,(
              result: parser.vars.source
            ))
            ''
        resultWithoutContent: ->
          if @editable
            parser = new Codewave(new Codewave.TextParser(
              """
              ~~box cmd:"#{@instance.noBracket}"~~
              ~~source~~
              #{@cmd.result}|
              ~~/source~~
              ~~save~~ ~~!close~~
              ~~/box~~
              """))
            parser.checkCarret = no
            if @verbalize then parser.getText() else parser.parseAll()
  )
)