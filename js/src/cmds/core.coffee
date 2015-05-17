# [pawa python]
#   replace @Codewave.Command.cmdInitialisers command.cmdInitialisersBaseCommand
#   replace (BaseCommand (command.BaseCommand
#   replace EditCmd.props editCmdProps
#   replace EditCmd.setCmds editCmdSetCmds reparse

initCmds = ->
  core = Codewave.Command.cmds.addCmd(new Codewave.Command('core'))
  core.addDetector(new Codewave.LangDetector())
  
  core.addCmds({
    'help':{
      'replaceBox' : true,
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
          'replaceBox' : true,
          'result' : """
            ~~box~~
            ~~!help~~
            ~~!help:get_started~~ (~~!help:demo~~)
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
          'replaceBox' : true,
          'result' : """
            ~~box~~
            The classic Hello World.
            ~~!hello|~~
            
            ~~help:editing:intro~~
            ~~quote_carret~~
            
            for more information on creating your own commands, see:
            ~~!help:editing~~
            
            Codewave come with many prexisting commands. Here an example of 
            javascript abreviations
            ~~!js:f~~
            ~~!js:if~~
              ~~!js:log~~"~~!hello~~"~~!/js:log~~
            ~~!/js:if~~
            ~~!/js:f~~
            
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
                Codewave allows you to make your own commands (or abbreviations) 
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
          'replaceBox' : true,
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
    'param':{
      'result' : getParam
    },
    'edit':{
      'cmds' : EditCmd.setCmds({
        'save':{
          'aliasOf': 'core:exec_parent'
        }
      }),
      'cls' : EditCmd
    },
    'rename':{
      'cmds' : {
        'not_applicable' : """
          ~~box~~
          You cant rename a command you did not create yourself.
          ~~!close|~~
          ~~/box~~
          """,
        'not_found' : """
          ~~box~~
          Command not found
          ~~!close|~~
          ~~/box~~
          """
      }
      'result' : renameCommand,
      'parse' : true
    },
    'remove':{
      'cmds' : {
        'not_applicable' : """
          ~~box~~
          You cant remove a command you did not create yourself.
          ~~!close|~~
          ~~/box~~
          """,
        'not_found' : """
          ~~box~~
          Command not found
          ~~!close|~~
          ~~/box~~
          """
      }
      'result' : removeCommand,
      'parse' : true
    },
    'alias':{
      'cmds' : {
        'not_found' : """
          ~~box~~
          Command not found
          ~~!close|~~
          ~~/box~~
          """
      }
      'result' : aliasCommand,
      'parse' : true
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
  
@Codewave.Command.cmdInitialisers.push(initCmds)

@Codewave.Command.setVarCmd = (name,base={}) -> 
  base.execute = (instance) ->
    val = if (p = instance.getParam(0))?
      p
    else if instance.content
      instance.content
    instance.codewave.vars[name] = val if val?
  return base

@Codewave.Command.setBoolVarCmd = (name,base={}) -> 
  base.execute = (instance) ->
    val = if (p = instance.getParam(0))?
      p
    else if instance.content
      instance.content
    unless val? and val in ['0','false','no']
      instance.codewave.vars[name] = true
  return base
  
no_execute = (instance) ->
  reg = new RegExp("^("+Codewave.util.escapeRegExp(instance.codewave.brakets) + ')' + Codewave.util.escapeRegExp(instance.codewave.noExecuteChar))
  return instance.str.replace(reg,'$1')
  
quote_carret = (instance) ->
  return instance.content.replace(/\|/g, '||') # [pawa python] replace '/\|/g' "'|'"
exec_parent = (instance) ->
  if instance.parent?
    res = instance.parent.execute()
    instance.replaceStart = instance.parent.replaceStart
    instance.replaceEnd = instance.parent.replaceEnd
    return res
getContent = (instance) ->
  affixes_empty = instance.getParam(['affixes_empty'],false)
  prefix = instance.getParam(['prefix'],'')
  suffix = instance.getParam(['suffix'],'')
  if instance.codewave.inInstance?
    return prefix + (instance.codewave.inInstance.content or '') + suffix
  if affixes_empty
    return prefix + suffix
renameCommand = (instance) ->
  savedCmds = Codewave.storage.load('cmds')
  origninalName = instance.getParam([0,'from'])
  newName = instance.getParam([1,'to'])
  if origninalName? and newName?
    cmd = instance.context.getCmd(origninalName)
    if savedCmds[origninalName]? and cmd?
      unless newName.indexOf(':') > -1
        newName = cmd.fullName.replace(origninalName,'') + newName
      cmdData = savedCmds[origninalName]
      Codewave.Command.cmds.setCmdData(newName,cmdData)
      cmd.unregister()
      savedCmds[newName] = cmdData
      delete savedCmds[origninalName]
      Codewave.storage.save('cmds',savedCmds)
      return ""
    else if cmd? 
      return "~~not_applicable~~"
    else 
      return "~~not_found~~"
removeCommand = (instance) ->
  name = instance.getParam([0,'name'])
  if name?
    savedCmds = Codewave.storage.load('cmds')
    cmd = instance.context.getCmd(name)
    if savedCmds[name]? and cmd?
      cmdData = savedCmds[name]
      cmd.unregister()
      delete savedCmds[name]
      Codewave.storage.save('cmds',savedCmds)
      return ""
    else if cmd? 
      return "~~not_applicable~~"
    else 
      return "~~not_found~~"
aliasCommand = (instance) ->
  name = instance.getParam([0,'name'])
  alias = instance.getParam([1,'alias'])
  if name? and alias?
    cmd = instance.context.getCmd(name)
    if cmd?
      cmd = cmd.getAliased() or cmd
      # unless alias.indexOf(':') > -1
        # alias = cmd.fullName.replace(name,'') + alias
      Codewave.Command.saveCmd(alias, { aliasOf: cmd.fullName })
      return ""
    else 
      return "~~not_found~~"
      
getParam = (instance) ->
  if instance.codewave.inInstance?
    return instance.codewave.inInstance.getParam(instance.params,instance.getParam(['def','default']))
  
class BoxCmd extends Codewave.BaseCommand
  init: ->
    @helper = new Codewave.util.BoxHelper(@instance.context)
    @cmd = @instance.getParam(['cmd'])
    if @cmd?
      @helper.openText  = @instance.codewave.brakets + @cmd + @instance.codewave.brakets
      @helper.closeText = @instance.codewave.brakets + @instance.codewave.closeChar + @cmd.split(" ")[0] + @instance.codewave.brakets
    @helper.deco = @instance.codewave.deco
    @helper.pad = 2
    @helper.prefix = @instance.getParam(['prefix'],'')
    @helper.suffix = @instance.getParam(['suffix'],'')
    
  height: ->
    if @bounds()?
      height = @bounds().height
    else
      height = 3
      
    params = ['height']
    if @instance.params.length > 1 
      params.push(1)
    else if @instance.params.length > 0
      params.push(0)
    return @instance.getParam(params,height)
      
  width: ->
    if @bounds()?
      width = @bounds().width
    else
      width = 3
      
    params = ['width']
    if @instance.params.length > 1 
      params.push(0)
    return Math.max(@minWidth(), @instance.getParam(params, width))

  
  bounds: ->
    if @instance.content
      unless @_bounds?
        @_bounds = @helper.textBounds(@instance.content)
      return @_bounds
      
  result: ->
    @helper.height = @height()
    @helper.width = @width()
    return @helper.draw(@instance.content)
  minWidth: ->
    if @cmd?
      return @cmd.length
    else
      return 0
  
class CloseCmd extends Codewave.BaseCommand
  init: ->
    @helper = new Codewave.util.BoxHelper(@instance.context)
  execute: ->
    prefix = @helper.prefix = @instance.getParam(['prefix'],'')
    suffix = @helper.suffix = @instance.getParam(['suffix'],'')
    box = @helper.getBoxForPos(@instance.getPos())
    required_affixes = @instance.getParam(['required_affixes'],true)
    if !required_affixes
      @helper.prefix = @helper.suffix = ''
      box2 = @helper.getBoxForPos(@instance.getPos())
      if box2? and (!box? or box.start < box2.start - prefix.length or box.end > box2.end + suffix.length)
        box = box2
    if box?
      depth = @helper.getNestedLvl(@instance.getPos().start)
      if depth < 2
        @instance.inBox = null
      @instance.applyReplacement(new Codewave.util.Replacement(box.start,box.end,''))
    else
      @instance.replaceWith('')
          
class EditCmd extends Codewave.BaseCommand
  init: ->
    @cmdName = @instance.getParam([0,'cmd'])
    @verbalize = @instance.getParam([1]) in ['v','verbalize']
    if @cmdName?
      @finder = @instance.context.getFinder(@cmdName) 
      @finder.useFallbacks = false
      @cmd = @finder.find()
    @editable = if @cmd? then @cmd.isEditable() else true
  getOptions: ->
    return {
      allowedNamed: ['cmd']
    }
  result: ->
    if @instance.content
      return @resultWithContent()
    else
      return @resultWithoutContent()
  resultWithContent: ->
      parser = @instance.getParserForText(@instance.content)
      parser.parseAll()
      data = {}
      for p in EditCmd.props
        p.writeFor(parser,data)
      Codewave.Command.saveCmd(@cmdName, data)
      return ''
  propsDisplay: ->
      cmd = @cmd
      return EditCmd.props.map( (p)-> p.display(cmd) ).filter( (p)-> p? ).join("\n")
  resultWithoutContent: ->
    if !@cmd or @editable
      name = if @cmd then @cmd.fullName else @cmdName
      parser = @instance.getParserForText(
        """
        ~~box cmd:"#{@instance.cmd.fullName} #{name}"~~
        #{@propsDisplay()}
        ~~save~~ ~~!close~~
        ~~/box~~
        """)
      parser.checkCarret = no
      return if @verbalize then parser.getText() else parser.parseAll()
EditCmd.setCmds = (base) ->
  for p in EditCmd.props
    p.setCmd(base)
  return base
EditCmd.props = [
  new Codewave.EditCmdProp.revBool('no_carret',         {opt:'checkCarret'}),
  new Codewave.EditCmdProp.revBool('no_parse',          {opt:'parse'}),
  new Codewave.EditCmdProp.bool(   'prevent_parse_all', {opt:'preventParseAll'}),
  new Codewave.EditCmdProp.bool(   'replace_box',       {opt:'replaceBox'}),
  new Codewave.EditCmdProp.string( 'name_to_param',     {opt:'nameToParam'}),
  new Codewave.EditCmdProp.string( 'alias_of',          {var:'aliasOf', carret:true}),
  new Codewave.EditCmdProp.source( 'help',              {funct:'help', showEmpty:true}),
  new Codewave.EditCmdProp.source( 'source',            {var:'resultStr', dataName:'result', showEmpty:true, carret:true}),
]
class NameSpaceCmd extends Codewave.BaseCommand
  init: ->
    @name = @instance.getParam([0])
  result: ->
    if @name?
      @instance.codewave.getRoot().context.addNameSpace(@name)
      return ''
    else
      namespaces = @instance.context.getNameSpaces()
      txt = '~~box~~\n'
      for nspc in namespaces 
        if nspc != @instance.cmd.fullName
          txt += nspc+'\n'
      txt += '~~!close|~~\n~~/box~~'
      parser = @instance.getParserForText(txt)
      return parser.parseAll()



class EmmetCmd extends @Codewave.BaseCommand
  init: ->
    @abbr = @instance.getParam([0,'abbr','abbreviation'])
    @lang = @instance.getParam([1,'lang','language'])
  result: ->
    emmet = if window.emmet?
      window.emmet
    else if window.self?.emmet?
      window.self.emmet
    else if window.global?.emmet?
      window.global.emmet
    if emmet?
      # emmet.require('./parser/abbreviation').expand('ul>li', {pastedContent:'lorem'})
      res = emmet.expandAbbreviation(@abbr, @lang)
      res.replace(/\$\{0\}/g, '|')



