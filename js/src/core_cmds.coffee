

initCmds = ->
  core = Codewave.Command.cmds.addCmd(new Codewave.Command('core'))
  core.addDetector(new Codewave.LangDetector())
  
  core.addCmds({
    'help':{
      'result' : """
        ~~box~~
        ~~quote_carret~~
          ___         _   __      __
         / __|___  __| |__\ \    / /_ ___ ______
        / /__/ _ \/ _` / -_\ \/\/ / _` \ V / -_/
        \____\___/\__,_\___|\_/\_/\__,_|\_/\___|
        The text editor helper
        ~~/quote_carret~~
        ~~!close|~~
        ~~/box~~
        """
    },
    'no_execute':{
      'result' : no_execute
    },
    'quote_carret':{
      'result' : quote_carret,
      'checkCarret' : false
    },
    'exec_parent':{
      'execute' : exec_parent
    },
    'content':{
      'result' : getContent
    },
    'box':{
      'cls' : BoxCmd
    },
    'close':{
      'cls' : CloseCmd
    },
    'edit':{
      'cmds' : {
        'source': setVarCmd('source'),
        'save':{
          'aliasOf': 'core:exec_parent'
        }
      },
      'cls' : EditCmd
    },
    'namespace':{
      'cls' : NameSpaceCmd
    },
    'nspc':{
      'aliasOf' : 'core:namespace'
    },
    'emmet':{
      'cls' : EmmetCmd
    },
    
  })
  
  html = Codewave.Command.cmds.addCmd(new Codewave.Command('html'))
  html.addCmds({
    'fallback':{
      'aliasOf' : 'core:emmet',
      'defaults' : {'lang':'html'},
      'nameToParam' : 'abbr'
    },
  })
  
  css = Codewave.Command.cmds.addCmd(new Codewave.Command('css'))
  css.addCmds({
    'fallback':{
      'aliasOf' : 'core:emmet',
      'defaults' : {'lang':'css'},
      'nameToParam' : 'abbr'
    },
  })
  
  php = Codewave.Command.cmds.addCmd(new Codewave.Command('php'))
  php.addDetector(new Codewave.PairDetector({result:'php:inner',opener:'<?php',closer:'?>','else':'php:outer'}))

  phpOuter = php.addCmd(new Codewave.Command('outer'))
  phpOuter.addCmds({
    'fallback':{
      aliasOf: 'php:inner:%name%',
      beforeExecute: closePhpForContent
      alterResult: wrapWithPhp
    },
  })
  
  phpInner = php.addCmd(new Codewave.Command('inner'))
  phpInner.addCmds({
    'if':'if(|){\n\t~~content~~\n}'
  })

@Codewave.Command.cmdInitialisers.push(initCmds)

setVarCmd = (name) -> 
  (
    execute: (instance) ->
      val = if (p = instance.getParam(0))?
        p
      else if instance.content
        instance.content
      instance.codewave.vars[name] = val if val?
  )
  
no_execute = (instance) ->
  reg = new RegExp("^("+Codewave.util.escapeRegExp(instance.codewave.brakets) + ')' + Codewave.util.escapeRegExp(instance.codewave.noExecuteChar))
  instance.str.replace(reg,'\\1')
  
quote_carret = (instance) ->
  return instance.content.replace(/\|/g, '||')
exec_parent = (instance) ->
  if instance.parent?
    res = instance.parent.execute()
    instance.replaceStart = instance.parent.replaceStart
    instance.replaceEnd = instance.parent.replaceEnd
    return res
getContent = (instance) ->
  if instance.codewave.context?
    instance.codewave.context.content
wrapWithPhp = (result) ->
  regOpen = /<\?php\s([\\n\\r\s]+)/g
  regClose = /([\n\r\s]+)\s\?>/g
  '<?php ' + result.replace(regOpen, '$1<?php ').replace(regClose, ' ?>$1') + ' ?>'
closePhpForContent = (instance) ->
  instance.content = ' ?>'+instance.content+'<?php '
class BoxCmd extends @Codewave.BaseCommand
  constructor: (@instance)->
    if @instance.content
      bounds = @textBounds(@instance.content)
      [@width, @height] = [bounds.width, bounds.height]
    else
      @width = 50
      @height = 3
    
    params = ['width']
    if @instance.params.length > 1 
      params.push(0)
    @width = @instance.getParam(params,@width)
      
    params = ['height']
    if @instance.params.length > 1 
      params.push(1)
    else if @instance.params.length > 0
      params.push(0)
    @height = @instance.getParam(params,@height)
    
    @cmd = @instance.getParam(['cmd'])
    @deco = @instance.codewave.deco
    @pad = 2
  result: ->
    return @startSep() + "\n" + @lines(@instance.content) + "\n"+ @endSep()
  wrapComment: (str) ->
    @instance.codewave.wrapComment(str)
  separator: ->
    len = @width + 2 * @pad + 2 * @deco.length
    @wrapComment(@decoLine(len))
  startSep: ->
    cmd = ''
    if @cmd?
      cmd = @instance.codewave.brakets+@cmd+@instance.codewave.brakets
    ln = @width + 2 * @pad + 2 * @deco.length - cmd.length
    @wrapComment(cmd+@decoLine(ln))
  endSep: ->
    closing = ''
    if @cmd?
      closing = @instance.codewave.brakets+@instance.codewave.closeChar+@cmd.split(" ")[0]+@instance.codewave.brakets
    ln = @width + 2 * @pad + 2 * @deco.length - closing.length
    @wrapComment(closing+@decoLine(ln))
  decoLine: (len) ->
    return Codewave.util.repeatToLength(self.deco, len)
  padding: -> 
    return Codewave.util.repeatToLength(" ", @pad)
  lines: (text = '') ->
    text = text or ''
    lines = text.replace(/\r/g, '').split("\n")
    return (@line(lines[x] or '') for x in [0..@height]).join('\n') 
  line: (text = '') ->
    @wrapComment(
      @deco +
      @padding() +
      text +
      Codewave.util.repeatToLength(" ", @width - @instance.codewave.removeCarret(text).length) + 
      @padding() +
      @deco
    )
  textBounds: (text) ->
    Codewave.util.getTxtSize(@instance.codewave.removeCarret(text))
    
class CloseCmd extends @Codewave.BaseCommand
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
    end = @instance.codewave.findNext(@instance.getEndPos(), endFind)
    if start? and end?
      @instance.codewave.editor.spliceText(start,end + endFind.length,'')
      @instance.codewave.editor.setCursorPos(start)
    else
      @instance.replaceWith('')
          
class EditCmd extends @Codewave.BaseCommand
  constructor: (@instance)->
    @cmdName = @instance.getParam([0,'cmd'])
    @verbalize = @instance.getParam([1]) in ['v','verbalize']
    @cmd = if @cmdName? then @instance.codewave.getCmd(@cmdName) else null
    @editable = if @cmd? then @cmd.isEditable() else true
    @content = @instance.content
  result: ->
    if @content
      @resultWithContent()
    else
      @resultWithoutContent()
  resultWithContent: ->
      parser = @instance.getParserForText(@content)
      parser.parseAll()
      Codewave.Command.saveCmd(@cmdName,(
        result: parser.vars.source
      ))
      ''
  resultWithoutContent: ->
    if !@cmd or @editable
      source = if @cmd then @cmd.resultStr else '|'
      name = if @cmd then @cmd.fullName else @cmdName
      parser = @instance.getParserForText(
        """
        ~~box cmd:"#{@instance.cmd.fullName} #{name}"~~
        ~~source~~
        #{source}|
        ~~/source~~
        ~~save~~ ~~!close~~
        ~~/box~~
        """)
      parser.checkCarret = no
      if @verbalize then parser.getText() else parser.parseAll()

class NameSpaceCmd extends @Codewave.BaseCommand
  constructor: (@instance) ->
    @name = @instance.getParam([0])
    #
  result: ->
    if @name?
      @instance.codewave.getRoot().addNameSpace(@name)
      return ''
    else
      namespaces = @instance.finder.namespaces
      txt = '~~box~~\n'
      for nspc in namespaces 
        txt += nspc+'\n'
      txt += '~~!close|~~\n~~/box~~'
      parser = @instance.getParserForText(txt)
      return parser.parseAll()



class EmmetCmd extends @Codewave.BaseCommand
  constructor: (@instance) ->
    @abbr = @instance.getParam([0,'abbr','abbreviation'])
    @lang = @instance.getParam([1,'lang','language'])
  result: ->
    if emmet?
      # emmet.require('./parser/abbreviation').expand('ul>li', {pastedContent:'lorem'})
      res = emmet.expandAbbreviation(@abbr, @lang)
      res.replace(/\$\{0\}/g, '|')

