
import { Command, BaseCommand } from '../Command';
import { LangDetector } from '../detectors/LangDetector';
import { AlwaysEnabled } from '../detectors/AlwaysEnabled';
import { BoxHelper } from '../BoxHelper';
import { EditCmdProp } from '../EditCmdProp';
import { StringHelper } from '../helpers/StringHelper';
import { PathHelper } from '../helpers/PathHelper';
import { Replacement } from '../positioning/Replacement';

export class CoreCommandProvider
 register: (cmds)-> 
  core = cmds.addCmd(new Command('core'))
  cmds.addDetector(new AlwaysEnabled('core'))
  core.addDetector(new LangDetector())
  
  core.addCmds({
    'help':{
      'replaceBox' : true,
      'result' : help,
      'parse' : true,
      'allowedNamed' : ['cmd'],
      'help' : """
        To get help on a pecific command, do :
        ~~help hello~~ (hello being the command)
        """ 
      'cmds' : {
        'overview':{
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
            
            When using Codewave you will be writing commands within 
            your text editor. These commands must be placed between two 
            pairs of "~" (tilde) and then, they can be executed by pressing 
            "ctrl"+"shift"+"e", with your cursor inside the command
            Ex: ~~!hello~~
            
            You dont need to actually type any "~" (tilde). 
            Pressing "ctrl"+"shift"+"e" will add them if you are not already
            within a command.
            
            Codewave does not use UI to display any information. 
            Instead, it uses text within code comments to mimic UIs. 
            The generated comment blocks will be referred to as windows 
            in the help sections.
            
            To close this window (i.e. remove this comment block), press 
            "ctrl"+"shift"+"e" with your cursor on the line bellow.
            ~~!close|~~
            
            Use the following command for a walkthrough of some of the many
            features of Codewave
            ~~!help:get_started~~ or ~~!help:demo~~
            
            List of all help subjects 
            ~~!help:subjects~~ or ~~!help:sub~~ 
            
            ~~!close~~
            ~~/box~~
            """
        }
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
          'aliasOf': 'core:help:subjects'
        }
        'get_started':{
          'replaceBox' : true,
          'result' : """
            ~~box~~
            The classic Hello World.
            ~~!hello|~~
            
            ~~help:editing:intro~~
            ~~quote_carret~~
            
            For more information on creating your own commands, see:
            ~~!help:editing~~
            
            Codewave comes with many pre-existing commands. Here is an example
            of JavaScript abbreviations
            ~~!js:f~~
            ~~!js:if~~
              ~~!js:log~~"~~!hello~~"~~!/js:log~~
            ~~!/js:if~~
            ~~!/js:f~~
            
            CodeWave comes with the excellent Emmet ( http://emmet.io/ ) to 
            provide event more abbreviations. Emmet abbreviations will be 
            used automatically if you are in a HTML or CSS file.
            ~~!ul>li~~ (if you are in a html doccument)
            ~~!emmet ul>li~~
            ~~!emmet m2 css~~
            
            Commands are stored in namespaces. The same command can have 
            different results depending on the namespace.
            ~~!js:each~~
            ~~!php:outer:each~~
            ~~!php:inner:each~~
            
            Some of the namespaces are active depending on the context. The
            following commands are the same and will display the currently
            active namespace. The first command command works because the 
            core namespace is active.
            ~~!namespace~~
            ~~!core:namespace~~
            
            You can make a namespace active with the following command.
            ~~!namespace php~~
            
            Check the namespaces again
            ~~!namespace~~
            
            In addition to detecting the document type, Codewave can detect the
            context from the surrounding text. In a PHP file, it means Codewave 
            will add the PHP tags when you need them.
            
            ~~/quote_carret~~
            ~~!close|~~
            ~~/box~~
            """
        }
        'demo':{
          'aliasOf': 'core:help:get_started'
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
            
            All the windows of Codewave are made with the command "box". 
            They are meant to display text that should not remain in your code. 
            They are valid comments so they won't break your code and the command 
            "close" can be used to remove them rapidly. You can make your own 
            commands with them if you need to display some text temporarily.
            ~~!box~~
            The box will scale with the content you put in it
            ~~!close|~~
            ~~!/box~~
            
            ~~quote_carret~~
            When you create a command, you may want to specify where the cursor 
            will be located once the command is expanded. To do that, use a "|" 
            (Vertical bar). Use 2 of them if you want to print the actual 
            character.
            ~~!box~~
            one : | 
            two : ||
            ~~!/box~~
            
            You can also use the "escape_pipes" command that will escape any 
            vertical bars that are between its opening and closing tags
            ~~!escape_pipes~~
            |
            ~~!/escape_pipes~~
            
            Commands inside other commands will be expanded automatically.
            If you want to print a command without having it expand when 
            the parent command is expanded, use a "!" (exclamation mark).
            ~~!!hello~~
            
            For commands that have both an opening and a closing tag, you can use
            the "content" command. "content" will be replaced with the text
            that is between the tags. Here is an example of how it can be used.
            ~~!edit php:inner:if~~
            
            ~~/quote_carret~~
            ~~!close|~~
            ~~/box~~
            """
        }
        'edit':{
          'aliasOf': 'core:help:editing'
        }
        'not_found' : """
          ~~box~~
          Command not found
          ~~!close|~~
          ~~/box~~
          """
      }
    },
    'no_execute':{
      'result' : no_execute
      'help': """
        Prevent everything inside the open and close tag from executing
        """
    },
    'escape_pipes':{
      'result' : quote_carret,
      'checkCarret' : false
      'help': """
        Escape all carrets (from "|" to "||")
        """
    },
    'quote_carret':{
      'aliasOf': 'core:escape_pipes'
    }
    'exec_parent':{
      'execute' : exec_parent
      'help': """
        Execute the first command that wrap this in it's open and close tag
        """
    },
    'content':{
      'result' : getContent
      'help': """
        Mainly used for command edition, 
        this will return what was between the open and close tag of a command
        """
    },
    'box':{
      'cls' : BoxCmd
      'help': """
        Create the apparence of a box composed from characters. 
        Usually wrapped in a comment.

        The box will try to ajust it's size from the content
        """
    },
    'close':{
      'cls' : CloseCmd
      'help': """
        Will close the first box around this
        """
    },
    'param':{
      'result' : getParam
      'help': """
        Mainly used for command edition, 
        this will return a parameter from this command call

        You can pass a number, a string, or both. 
        A number for a positioned argument and a string
        for a named parameter
        """
    },
    'edit':{
      'cmds' : EditCmd.setCmds({
        'save':{
          'aliasOf': 'core:exec_parent'
        }
      }),
      'cls' : EditCmd,
      'allowedNamed':['cmd']
      'help': """
        Allows to edit a command. 
        See ~~!help:editing~~ for a quick tutorial
        """
    },
    'rename':{
      'cmds' : {
        'not_applicable' : """
          ~~box~~
          You can only rename commands that you created yourself.
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
      'parse' : true,
      'allowedNamed':['from','to']
      'help': """
        Allows to rename a command and change it's namespace. 
        You can only rename commands that you created yourself.
        - The first param is the old name
        - Then second param is the new name, if it has no namespace,
          it will use the one from the original command.

        ex.: ~~!rename my_command my_command2~~
        """
    },
    'remove':{
      'cmds' : {
        'not_applicable' : """
          ~~box~~
          You can only remove commands that you created yourself.
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
      'allowedNamed':['cmd']
      'help': """
        Allows to remove a command. 
        You can only remove commands that you created yourself.
        """
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
      'help': """
        Show the current namespaces.

        A name space could be the name of the language
        or other kind of contexts

        If you pass a param to this command, it will 
        add the param as a namespace for the current editor
        """
    },
    'nspc':{
      'aliasOf' : 'core:namespace'
    },
    'list':{
      'result' : listCommand
      'allowedNamed':['name','box','context']
      'replaceBox' : true,
      'parse' : true
      'help': """
        List available commands

        You can use the first argument to choose a specific namespace, 
        by default all curent namespace will be shown
        """
    },
    'ls':{
      'aliasOf' : 'core:list'
    },
    'get':{
      'result' : getCommand
      'allowedNamed':['name']
      'help': """
        output the value of a variable
        """
    },
    'set':{
      'result' : setCommand
      'allowedNamed':['name','value','val']
      'help': """
        set the value of a variable
        """
    },
    'store_json':{
      'result' : storeJsonCommand
      'allowedNamed':['name','json']
      'help': """
        set a variable with some json data
        """
    },
    'json':{
      'aliasOf' : 'core:store_json'
    },
    'template':{
      'cls' : TemplateCmd
      'allowedNamed':['name','sep']
      'help': """
        render a template for a variable

        If the first param is not set it will use all variables 
        for the render
        If the variable is an array the template will be repeated 
        for each items
        The `sep` param define what will separate each item 
        and default to a line break
        """
    },
    'emmet':{
      'cls' : EmmetCmd
      'help': """
        CodeWave comes with the excellent Emmet ( http://emmet.io/ ) to 
        provide event more abbreviations.

        Pass the Emmet abbreviation as a param to expend it.
        """
    },
    
  })
  
help = (instance) ->
  cmdName = instance.getParam([0,'cmd'])
  if cmdName?
    cmd = instance.context.getParentOrRoot().getCmd(cmdName)
    if cmd?
      helpCmd = cmd.getCmd('help')
      text = if helpCmd then "~~#{helpCmd.fullName}~~" else "This command has no help text"
      subcommands = if cmd.cmds.length
        """

        Sub-Commands :
        ~~ls #{cmd.fullName} box:no context:no~~
        """
      else 
        ""
      return """
        ~~box~~
        Help for ~~!#{cmd.fullName}~~ :

        #{text}
        #{subcommands}

        ~~!close|~~
        ~~/box~~
        """
    else 
      return "~~not_found~~"
  else
    return '~~help:overview~~'

no_execute = (instance) ->
  reg = new RegExp("^("+StringHelper.escapeRegExp(instance.codewave.brakets) + ')' + StringHelper.escapeRegExp(instance.codewave.noExecuteChar))
  return instance.str.replace(reg,'$1')
  
quote_carret = (instance) ->
  return instance.content.replace(/\|/g, '||')
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
  Promise.resolve().then =>
    storage = Command.storage
    storage.load('cmds')
  .then (savedCmds)=>
    origninalName = instance.getParam([0,'from'])
    newName = instance.getParam([1,'to'])
    if origninalName? and newName?
      cmd = instance.context.getParentOrRoot().getCmd(origninalName)
      if savedCmds[origninalName]? and cmd?
        unless newName.indexOf(':') > -1
          newName = cmd.fullName.replace(origninalName,'') + newName
        cmdData = savedCmds[origninalName]
        Command.cmds.setCmdData(newName,cmdData)
        cmd.unregister()
        savedCmds[newName] = cmdData
        delete savedCmds[origninalName]
        Promise.resolve().then =>
          storage.save('cmds',savedCmds)
        .then =>
          return ""
      else if cmd? 
        return "~~not_applicable~~"
      else 
        return "~~not_found~~"
removeCommand = (instance) ->
  Promise.resolve().then =>
    name = instance.getParam([0,'cmd'])
    if name?
      Promise.resolve().then =>
        storage = Command.storage
        savedCmds = storage.load('cmds')
      .then (savedCmds)=>
        cmd = instance.context.getParentOrRoot().getCmd(name)
        if savedCmds[name]? and cmd?
          cmdData = savedCmds[name]
          cmd.unregister()
          delete savedCmds[name]
          Promise.resolve().then =>
            storage.save('cmds',savedCmds)
          .then =>
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
      Command.saveCmd(alias, { aliasOf: cmd.fullName })
      return ""
    else 
      return "~~not_found~~"

listCommand = (instance) ->
  box = instance.getBoolParam(['box'],true)
  useContext = instance.getBoolParam(['context'],true)
  name = instance.getParam([0,'name'])
  namespaces = if name 
    [name] 
  else 
    instance.context.getNameSpaces().filter((nspc) => nspc != instance.cmd.fullName).concat("_root")

  context = if useContext
    instance.context.getParentOrRoot()
  else
    instance.codewave.getRoot().context

  commands = namespaces.reduce (commands, nspc) => 
      cmd = if nspc == "_root" then Command.cmds else context.getCmd(nspc,mustExecute:false)
      if cmd?
        cmd.init()
        if cmd.cmds
          commands = commands.concat(cmd.cmds)
      commands
    , []

  text = if commands.length 
    commands.map((cmd)=> 
      cmd.init()
      (if cmd.isExecutable() then '~~!' else '~~!ls ')+cmd.fullName+'~~'
    ).join("\n")
  else
    "This contains no sub-commands"

  if box
    """
      ~~box~~
      #{text}

      ~~!close|~~
      ~~/box~~
      """
  else
    text
  
getCommand = (instance) ->
  name = instance.getParam([0,'name'])
  res = PathHelper.getPath(instance.codewave.vars,name)
  if typeof res == "object"
    JSON.stringify(res,null,'  ')
  else
    res

setCommand = (instance) ->
  name = instance.getParam([0,'name'])
  val = if (p = instance.getParam([1,'value','val']))?
    p
  else if instance.content
    instance.content
  PathHelper.setPath(instance.codewave.vars,name,val)
  ''

storeJsonCommand = (instance) ->
  name = instance.getParam([0,'name'])
  val = if (p = instance.getParam([1,'json']))?
    p
  else if instance.content
    instance.content
  PathHelper.setPath(instance.codewave.vars,name, JSON.parse(val))
  ''

getParam = (instance) ->
  if instance.codewave.inInstance?
    return instance.codewave.inInstance.getParam(instance.params,instance.getParam(['def','default']))
  
class BoxCmd extends BaseCommand
  init: ->
    @helper = new BoxHelper(@instance.context)
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
  
class CloseCmd extends BaseCommand
  init: ->
    @helper = new BoxHelper(@instance.context)
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
      @instance.applyReplacement(new Replacement(box.start,box.end,''))
    else
      @instance.replaceWith('')
          
class EditCmd extends BaseCommand
  init: ->
    @cmdName = @instance.getParam([0,'cmd'])
    @verbalize = @instance.getParam([1]) in ['v','verbalize']
    if @cmdName?
      @finder = @instance.context.getParentOrRoot().getFinder(@cmdName) 
      @finder.useFallbacks = false
      @cmd = @finder.find()
    @editable = if @cmd? then @cmd.isEditable() else true
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
      Command.saveCmd(@cmdName, data)
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
        ~~!save~~ ~~!close~~
        ~~/box~~
        """)
      parser.checkCarret = no
      return if @verbalize then parser.getText() else parser.parseAll()
EditCmd.setCmds = (base) ->
  inInstance = base.in_instance = {cmds:{}}
  for p in EditCmd.props
    p.setCmd(inInstance.cmds)
    # p.setCmd(base)
  return base
EditCmd.props = [
  new EditCmdProp.revBool('no_carret',         {opt:'checkCarret'}),
  new EditCmdProp.revBool('no_parse',          {opt:'parse'}),
  new EditCmdProp.bool(   'prevent_parse_all', {opt:'preventParseAll'}),
  new EditCmdProp.bool(   'replace_box',       {opt:'replaceBox'}),
  new EditCmdProp.string( 'name_to_param',     {opt:'nameToParam'}),
  new EditCmdProp.string( 'alias_of',          {var:'aliasOf', carret:true}),
  new EditCmdProp.source( 'help',              {funct:'help', showEmpty:true}),
  new EditCmdProp.source( 'source',            {var:'resultStr', dataName:'result', showEmpty:true, carret:true}),
]
class NameSpaceCmd extends BaseCommand
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


class TemplateCmd extends BaseCommand
  init: ->
    @name = @instance.getParam([0,'name'])
    @sep = @instance.getParam(['sep'],"\n")
  result: ->
    data = if @name then PathHelper.getPath(@instance.codewave.vars, @name) else @instance.codewave.vars
    if @instance.content and data? and data != false
      if Array.isArray(data)
        data.map (item)=>@renderTemplate(item)
          .join(@sep)
      else
        @renderTemplate(data)
    else
      ''
  renderTemplate: (data) ->
      parser = @instance.getParserForText(@instance.content)
      parser.vars = if typeof data == "object" then data else {value:data}
      parser.checkCarret = no
      parser.parseAll()


class EmmetCmd extends BaseCommand
  init: ->
    @abbr = @instance.getParam([0,'abbr','abbreviation'])
    @lang = @instance.getParam([1,'lang','language'])
  result: ->
    emmet = if window?.emmet?
      window.emmet
    else if window?.self?.emmet?
      window.self.emmet
    else if window?.global?.emmet?
      window.global.emmet
    else if require? 
      try 
        require('emmet')
      catch ex
        @instance.codewave.logger.log('Emmet is not available, it may need to be installed manually')
        null
    if emmet?
      # emmet.require('./parser/abbreviation').expand('ul>li', {pastedContent:'lorem'})
      res = emmet.expandAbbreviation(@abbr, @lang)
      res.replace(/\$\{0\}/g, '|')



