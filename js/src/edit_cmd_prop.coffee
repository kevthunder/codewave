# [pawa]
#   replace Codewave.Command.set codewave_core.core_cmds.set

class @Codewave.EditCmdProp
  constructor: (@name,options) ->
    defaults = {
      'var' : null,
      'opt' : null,
      'funct' : null,
      'dataName' : null,
      'showEmpty' : false,
      'carret' : false,
    }
    for key in ['var','opt','funct']
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
      if @funct?
        return cmd[@funct]()
      if @var?
        return cmd[@var]
  showForCmd: (cmd) ->
    val = @valFromCmd(cmd)
    return @showEmpty or val?
  display: (cmd) ->
    if @showForCmd(cmd)
      """
      ~~#{@name}~~
      #{@valFromCmd(cmd) or ""}#{if @carret then "|" else ""}
      ~~/#{@name}~~
      """
    
    
class @Codewave.EditCmdProp.source extends @Codewave.EditCmdProp 
	valFromCmd: (cmd)->
		res = super(cmd)
		if res?
			res = res.replace(/\|/g, '||') # [pawa python] replace '/\|/g' "'|'"
		return res
  setCmd: (cmds)->
    cmds[@name] = Codewave.Command.setVarCmd(@name,{'preventParseAll' : true})
  showForCmd: (cmd) ->
    val = @valFromCmd(cmd)
    return (@showEmpty and !(cmd? and cmd.aliasOf?)) or val?
    
    
class @Codewave.EditCmdProp.string extends @Codewave.EditCmdProp
  display: (cmd) ->
    if @valFromCmd(cmd)?
      return "~~!#{@name} '#{@valFromCmd(cmd)}#{if @carret then "|" else ""}'~~"
    
    
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