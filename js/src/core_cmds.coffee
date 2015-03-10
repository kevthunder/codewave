

initCmds = ->
  core = Codewave.Command.cmds.addCmd(new Codewave.Command('core'))
  core.addDetector(new Codewave.LangDetector())
  
  core.addCmds({
    'help':{
      'result' : """
        ~~box~~
        ~~quote_carret~~
          ___         _   __      __
         / __|___  __| |__\\ \\    / /_ ___ ______
        / /__/ _ \\/ _` / -_\\ \\/\\/ / _` \\ V / -_/
        \\____\\___/\\__,_\\___|\\_/\\_/\\__,_|\\_/\\___|
        The text editor helper
        ~~/quote_carret~~
        
        When using Codewave you will be writing commands directly within 
        your text editor editing windows. These commands must be placed
        between two pairs of "~" (tilde) and then with you text either 
        inside or at the command, they can be executed by pressing 
        "ctrl"+"shift"+"e".
        Ex: ~~!hello~~
        
        One good thing about codewave is that you dont need to actually
        type any "~" (tilde), because pressing "ctrl"+"shift"+"e" will
        add them if you are not allready within a command
        
        Codewave does not relly use UI to display any information. 
        instead, it uses text within code comments to mimic UIs. The 
        generated comment blocks will be refered as windows in the help
        sections.
        
        To close this window (ie. remove this comment bloc), press 
        "ctrl"+"shift"+"e" with you cursor on the line bellow.
        ~~!close|~~
        
        Use the following command for a walkthrough of some of many
        features of codewave
        ~~!help:get_started~~ or ~~!help:demo~~
        
        List of all helps subjects 
        ~~!help:subjects~~ or ~~!help:sub~~ 
        
        ~~!close~~
        ~~/box~~
        """
      'cmds' : {
        'subjects':{
          'result' : """
            ~~box~~
            ~~!help~~
            ~~!help:get_started~~ (~~!help:start~~)
            ~~!help:subjects~~ (~~!help:sub~~)
            ~~!help:editing~~ (~~!help:edit~~)
            ~~!close|~~
            ~~/box~~
            """
        }
        'sub':{
          'aliasOf': 'help:subjects'
        }
        'get_started':{
          'result' : """
            ~~box~~
            The classic Hello World.
            ~~!hello|~~
            
            ~~help:editing:intro~~
            ~~quote_carret~~
            
            for more information on creating your own commands, see:
            ~~!help:editing~~
            
            Codewave come with many prexisting commands. Here an example of 
            php abreviations
            ~~!php:inner:if~~
              echo "~~!hello~~"
            ~~!/php:inner:if~~
            
            CodeWave come with the exellent Emmet ( http://emmet.io/ ) to 
            provide event more abreviations. Emmet will fire automaticaly if
            you are in a html or css file and no other command of the same 
            name were defined.
            ~~!ul>li~~ (if you are in a html doccument)
            ~~!emmet ul>li~~
            ~~!emmet m2 css~~
            
            Commands are stored in name spaces and some of the namespaces are
            active depending of the context or they can be called explicitly. 
            The two following commands are the same and will display the 
            currently  active namespace. The first command command works 
            because the core namespace is active.
            ~~!namespace~~
            ~~!core:namespace~~
            
            you can make an namespace active with the following command.
            ~~!namespace php~~
            
            Check the namespaces again
            ~~!namespace~~
            
            All the dialogs(windows) of codewave are made with the command 
            "box" and you can use it in your own commands. you can also use a
            "close" command to make it easy to get rid of the window.
            ~~!box~~
            The box will scale with the content you put in it
            ~~!close|~~
            ~~!/box~~
            
            ~~/quote_carret~~
            ~~!close|~~
            ~~/box~~
            """
        }
        'demo':{
          'aliasOf': 'help:get_started'
        }
        'editing':{
          'cmds' : {
            'intro':{
              'result' : """
                Codewave allows you to make you own commands (or abbreviations) 
                put your content inside "source" the do "save". Try adding any 
                text that is on your mind.
                ~~!edit my_new_command|~~
                
                If you did the last step right, you should see your text when you
                do the following command. It is now saved and you can use it 
                whenever you want.
                ~~!my_new_command~~
                """
            }
          }
          'result' : """
            ~~box~~
            ~~help:editing:intro~~
            
            ~~quote_carret~~
            When you make your command you may need to tell where the text cursor 
            will be located once the command is executed. To do that, use a "|" 
            (Vertical bar). Use 2 of them if you want to print the actual 
            character.
            ~~!box~~
            one : | 
            two : ||
            ~~!/box~~
            
            If you want to print a command without having it evalute when 
            the command is executed, use a "!" exclamation mark.
            ~~!!hello~~
            
            for commands that have both a openig and a closing tag, you can use
            the "content" command. "content" will be replaced with the text
            that is between tha tags. Look at the code of the following command
            for en example of how it can be used.
            ~~!edit php:inner:if~~
            
            ~~/quote_carret~~
            ~~!close|~~
            ~~/box~~
            """
        }
        'edit':{
          'aliasOf': 'help:editing'
        }
      }
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
        'source': Codewave.util.merge(setVarCmd('source'),{
          'preventParseAll' : true
        }),
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
  instance.str.replace(reg,'$1')
  
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
  init: ->
    @cmd = @instance.getParam(['cmd'])
    @deco = @instance.codewave.deco
    @pad = 2
    
    if @instance.content
      bounds = @textBounds(@instance.content)
      [@width, @height] = [bounds.width, bounds.height]
    else
      @width = 50
      @height = 3
    
    params = ['width']
    if @instance.params.length > 1 
      params.push(0)
    @width = Math.max(@minWidth(),@instance.getParam(params,@width))
      
    params = ['height']
    if @instance.params.length > 1 
      params.push(1)
    else if @instance.params.length > 0
      params.push(0)
    @height = @instance.getParam(params,@height)
    
  result: ->
    return @startSep() + "\n" + @lines(@instance.content) + "\n"+ @endSep()
  wrapComment: (str) ->
    @instance.codewave.wrapComment(str)
  separator: ->
    len = @width + 2 * @pad + 2 * @deco.length
    @wrapComment(@decoLine(len))
  minWidth: ->
    if @cmd?
      @cmd.length
    else
      0
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
    return Codewave.util.repeatToLength(@deco, len)
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
  init: ->
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
  init: ->
    @cmdName = @instance.getParam([0,'cmd'])
    @verbalize = @instance.getParam([1]) in ['v','verbalize']
    if @cmdName?
      @finder = @instance.codewave.getFinder(@cmdName) 
      @finder.useFallbacks = false
      @cmd = @finder.find()
    @editable = if @cmd? then @cmd.isEditable() else true
    @content = @instance.content
  getOptions: ->
    return {
      allowedNamed: ['cmd']
    }
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
      source = if @cmd then @cmd.resultStr else ''
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
  init: ->
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
  init: ->
    @abbr = @instance.getParam([0,'abbr','abbreviation'])
    @lang = @instance.getParam([1,'lang','language'])
  result: ->
    if emmet?
      # emmet.require('./parser/abbreviation').expand('ul>li', {pastedContent:'lorem'})
      res = emmet.expandAbbreviation(@abbr, @lang)
      res.replace(/\$\{0\}/g, '|')



