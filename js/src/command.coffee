# [pawa python]
#   replace Codewave.Command.cmds cmds
#   replace Codewave.Command Command
#   replace @Codewave.Command. ''


_optKey = (key,dict,defVal = null) ->
  # optional Dictionary key
  if key of dict then dict[key] else defVal


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
      checkCarret: true,
      parse: false,
      beforeExecute: null,
      alterResult: null,
      preventParseAll: false,
      replaceBox: false,
    }
    @options = {}
    @finalOptions = null
  parent: ->
    return @_parent
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
    if !@_inited
      @_inited = true
      @parseData(@data)
    this
  unregister: ->
    @_parent.removeCmd(this)
  isEditable: ->
    @resultStr? or @aliasOf?
  isExecutable: ->
    aliased = @getAliased()
    if aliased?
      return aliased.isExecutable()
    for p in ['resultStr','resultFunct','cls','executeFunct']
      if this[p]?
        return true
    false
  resultIsAvailable: () ->
    aliased = @getAliased()
    if aliased?
      return aliased.resultIsAvailable()
    for p in ['resultStr','resultFunct']
      if this[p]?
        return true
    false
  getDefaults: () ->
    res = {}
    aliased = @getAliased()
    if aliased?
      res = Codewave.util.merge(res,aliased.getDefaults())
    res = Codewave.util.merge(res,@defaults)
    res
  _aliasedFromFinder: (finder) ->
      finder.useFallbacks = false
      finder.mustExecute = false
      return finder.find()
  getAliased: () ->
    if @aliasOf?
      context = new Codewave.Context()
      return @_aliasedFromFinder(context.getFinder(@aliasOf))
  setOptions: (data) ->
    for key, val of data
      if key of @defaultOptions
        @options[key] = val
  _optionsForAliased: (aliased) ->
    opt = {}
    opt = Codewave.util.merge(opt,@defaultOptions)
    if aliased?
      opt = Codewave.util.merge(opt,aliased.getOptions())
    return Codewave.util.merge(opt,@options)
  getOptions: () ->
    return @_optionsForAliased(@getAliased())
  getOption: (key) ->
    options = @getOptions()
    if key of options
      return options[key]
  parseData: (data) ->
    @data = data
    if typeof data == 'string'
      @resultStr = data
      @options['parse'] = true
      return true
    else if data?
      return @parseDictData(data)
    return false
  parseDictData: (data) ->
    res = _optKey('result',data)
    if typeof res == "function"
      @resultFunct = res
    else if res?
      @resultStr = res
      @options['parse'] = true
    execute = _optKey('execute',data)
    if typeof execute == "function"
      @executeFunct = execute
    @aliasOf = _optKey('aliasOf',data)
    @cls = _optKey('cls',data)
    @defaults = _optKey('defaults',data,@defaults)
    
    @setOptions(data)
    
    if 'help' of data
      @addCmd(new Command('help',data['help'],this))
    if 'fallback' of data
      @addCmd(new Command('fallback',data['fallback'],this))
      
    if 'cmds' of data
      @addCmds(data['cmds'])
    return true
  addCmds: (cmds) ->
    for name, data of cmds
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
    [space,name] = Codewave.util.splitFirstNamespace(fullname)
    if space?
      return @getCmd(space).getCmd(name)
    for cmd in @cmds
      if cmd.name == name
        return cmd
  setCmdData: (fullname,data) ->
    @setCmd(fullname,new Codewave.Command(fullname.split(':').pop(),data))
  setCmd: (fullname,cmd) ->
    [space,name] = Codewave.util.splitFirstNamespace(fullname)
    if space?
      next = @getCmd(space)
      unless next?
        next = @addCmd(new Command(space))
      return next.setCmd(name,cmd)
    else
      @addCmd(cmd)
      return cmd
  addDetector: (detector) ->
    @detectors.push(detector)
    
@Codewave.Command.cmdInitialisers = []

@Codewave.Command.initCmds = ->
  Codewave.Command.cmds = new Codewave.Command(null,{
    'cmds':{
      'hello':{
        help: """
        "Hello, world!" is typically one of the simplest programs possible in
        most programming languages, it is by tradition often (...) used to
        verify that a language or system is operating correctly -wikipedia
        """
        result: 'Hello, World!'
      }
    }
  })
  for initialiser in Codewave.Command.cmdInitialisers
    initialiser()

@Codewave.Command.saveCmd = (fullname, data) ->
  Codewave.Command.cmds.setCmdData(fullname,data)
  savedCmds = Codewave.storage.load('cmds')
  unless savedCmds?
    savedCmds = {}
  savedCmds[fullname] = data
  Codewave.storage.save('cmds',savedCmds)

@Codewave.Command.loadCmds = ->
  savedCmds = Codewave.storage.load('cmds')
  if savedCmds? 
    for fullname, data of savedCmds
      Codewave.Command.cmds.setCmdData(fullname, data)

  


class @Codewave.BaseCommand
  constructor: (@instance) ->
    #
  init: ->
    #
  resultIsAvailable: ->
    return this["result"]? # [pawa] replace this["result"]? 'hasattr(self,"result")'
  getDefaults: ->
    return {}
  getOptions: ->
    return {}
      