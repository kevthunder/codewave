
_optKey: (key,dict,defVal = null) ->
  # optional Dictionary key
  if key in dict then dict[key] else defVal


class @Codewave.Command
  constructor: (@name,@data=null,@parent=null) ->
    @cmds = []
    @detectors = []
    @executeFunct = @resultFunct = @resultStr = @aliasOf = @cls = null
    @aliased = null
    @fullName = @name
    @depth = 0
    [@_parent, @_inited] = [null, false]
    @setParent(parent)
    @defaults = {}
    
    @defaultOptions = {
      nameToParam: null,
      checkCarret: True,
      parse: false,
    }
    @options = {}
    @finalOptions = null
  setParent: (value) ->
    if @_parent != value
      @_parent = value
      @fullName = (
        if @_parent? and @_parent.name?
          @_parent.fullName + ':' + @name 
        else 
          @name
      )
      @depth = (
        if @_parent?
        then @_parent.depth + 1
        else 0
      )
  init: ->
    if not @_inited
      @_inited = true
      @parseData(@data)
    this
  isEditable: ->
    @resultStr?
  isExecutable: ->
    for p in ['resultStr','resultFunct','aliasOf','cls','executeFunct']
      if this[p]?
        return true
    false
  resultIsAvailable: (instance = null) ->
    if instance? and instance.cmdObj?
      return instance.cmdObj.resultIsAvailable()
    for p in ['resultStr','resultFunct']
      if this[p]?
        return true
    false
  getDefaults: (instance = null) ->
    res = {}
    aliased = @getAliased(instance)
    if aliased?
      res.update(aliased.getDefaults(instance))
    res.update(@defaults)
    if instance? and instance.cmdObj?
      res.update(instance.cmdObj.getDefaults())
    res
  result: (instance) ->
    if instance.cmdObj?
      return instance.cmdObj.result()
    aliased = @getAliased(instance)
    if aliased?
      return aliased.result(instance)
    if @resultFunct?
      return @resultFunct(instance)
    if @resultStr?
      @resultStr
  execute: (instance) ->
    if instance.cmdObj?
      return instance.cmdObj.execute()
    aliased = @getAliased(instance)
    if aliased?
      return aliased.execute(instance)
    if @executeFunct?
      return @executeFunct(instance)
  getExecutableObj: (instance) ->
    @init()
    if @cls?
      return @cls(instance)
    aliased = @getAliased(instance)
    if aliased?
      return aliased.getExecutableObj(instance)
  getAliased: (instance = null) ->
    if instance? and instance.cmd == this and instance.aliasedCmd?
      return instance.aliasedCmd or null
    if @aliasOf?
      if instance?
        codewave = codewave_core.codewave.Codewave()
      else :
        codewave = instance.codewave
      aliased = codewave.getCmd(@aliasOf)
      if instance?
        instance.aliasedCmd = aliased or false
      return aliased
  setOptions: (data) ->
    for key, val in data
      if key in @defaultOptions
        @options[key] = val
  getOptions: (instance = null) ->
    if instance? and instance.cmdOptions?
      return instance.cmdOptions
    opt = {}
    opt.update(@defaultOptions)
    aliased = @getAliased(instance)
    if aliased?
      opt.update(aliased.getOptions(instance))
    opt.update(@options)
    if instance? and instance.cmdObj?
      opt.update(instance.cmdObj.getOptions())
    if instance?
      instance.cmdOptions = opt
    return opt
  getOption: (key,instance = null) ->
    options = @getOptions(instance)
    if key in options
      return options[key]
  parseData: (data) ->
    @data = data
    if isinstance(data, str)
      @resultStr = data
      return true
    else if isinstance(data,dict)
      return @parseDictData(data)
    return false
  parseDictData: (data) ->
    res = _optKey('result',data)
    if typeof(res) == "function"
      @resultFunct = res
    else if res?
      @resultStr = res
      @options['parse'] = true
    execute = _optKey('execute',data)
    if typeof(execute) == "function"
      @executeFunct = execute
    @aliasOf = _optKey('aliasOf',data)
    @cls = _optKey('cls',data)
    @defaults = _optKey('defaults',data,@defaults)
    
    @setOptions(data)
    
    if 'help' in data
      @addCmd(this,new Command('help',data['help'],this))
    if 'fallback' in data
      @addCmd(this,new Command('fallback',data['fallback'],this))
    if 'cmds' in data
      @addCmds(data['cmds'])
    return true
  addCmds: (cmds) ->
    for name, data in cmds
      @addCmd(new Command(name,data,this))
  addCmd: (cmd) ->
    exists = @getCmd(cmd.name)
    if exists?
      @removeCmd(exists)
    cmd.setParent(this)
    @cmds.push(cmd)
    cmd
  removeCmd: (cmd) ->
    if (i = @cmds.indexOf(cmd)) > -1
      @cmds.splice(i, 1)
    return cmd
  getCmd: (fullname) ->
    @init()
    parts = fullname.split(':',1)
    name = parts.pop()
    if parts.length > 0
      return @getCmd(parts[0]).getCmd(name)
    for cmd in @cmds
      if cmd.name == name
        return cmd
  setCmd: (fullname,cmd) ->
    parts = fullname.split(':',1)
    name = parts.pop()
    if parts.length > 0
      next = @getCmd(parts[0])
      if next?
        next = @addCmd(new Command(parts[0]))
      return next.setCmd(name,cmd)
    else
      @addCmd(cmd)
      return cmd
  addDetector: (detector) ->
    @detectors.push(detector)
    
    
class @Codewave.BaseCommand
  constructor: (@instance) ->
    #
  resultIsAvailable: ->
    return this["result"]?
  getDefaults: ->
    return {}
  getOptions: ->
    return {}
      