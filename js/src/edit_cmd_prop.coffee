class @Codewave.EditCmdProp
  constructor: (@name,options) ->
    defaults = {
      'var' : null,
      'opt' : null,
      'dataName' : null,
    }
    for key in ['var','opt']
      if key of options
        defaults['dataName'] = options[key]
    for key, val of defaults
      if key of options
        this[key] = options[key]
      else
        this[key] = val
        
  setCmd: (cmds) ->
    cmds[@name] = Codewave.Command.setVarCmd(@name)
  
  writeFor: (parser,obj) ->
    if parser.vars[@name]?
      obj[@dataName] = parser.vars[@name]
  valFromCmd: (cmd) ->
    if cmd?
      if @opt?
        return cmd.getOption(@opt)
      if @var?
        return cmd[@var]
  display: (cmd) ->
    """
    ~~!#{@name}~~
    #{@valFromCmd(cmd) or ""}
    ~~!/#{@name}~~
    """
    
    
class @Codewave.EditCmdProp.source extends @Codewave.EditCmdProp 
  setCmd: (cmds)->
    cmds[@name] = Codewave.Command.setVarCmd(@name,{'preventParseAll' : true})
    
    
class @Codewave.EditCmdProp.string extends @Codewave.EditCmdProp
  display: (cmd) ->
    console.log(this,cmd)
    if @valFromCmd(cmd)?
      return "~~!#{@name} '#{@valFromCmd(cmd)}'~~"
    
    
class @Codewave.EditCmdProp.revBool extends @Codewave.EditCmdProp
  setCmd: (cmds) ->
    cmds[@name] = Codewave.Command.setBoolVarCmd(@name)
  writeFor: (parser,obj) ->
    if parser.vars[@name]?
      obj[@dataName] = !parser.vars[@name]
  display: (cmd) ->
    val = @valFromCmd(cmd)
    if val? and !val
      return "~~!#{@name}~~"

    
class @Codewave.EditCmdProp.bool extends @Codewave.EditCmdProp
  setCmd: (cmds) ->
    cmds[@name] = Codewave.Command.setBoolVarCmd(@name)
  display: (cmd) ->
    "~~!#{@name}~~" if @valFromCmd(cmd)