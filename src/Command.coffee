
import { Context } from './Context';
import { Storage } from './Storage';
import { NamespaceHelper } from './helpers/NamespaceHelper';


_optKey = (key,dict,defVal = null) ->
  # optional Dictionary key
  return if key of dict then dict[key] else defVal


export class Command
  constructor: (@name,@data=null,parent=null) ->
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
      allowedNamed: null
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
        if @_parent? and @_parent.depth?
        then @_parent.depth + 1
        else 0
      )
  init: ->
    if !@_inited
      @_inited = true
      @parseData(@data)
    return this
  unregister: ->
    @_parent.removeCmd(this)
  isEditable: ->
    return @resultStr? or @aliasOf?
  isExecutable: ->
    aliased = @getAliased()
    if aliased?
      return aliased.init().isExecutable()
    for p in ['resultStr','resultFunct','cls','executeFunct']
      if this[p]?
        return true
    return false
  isExecutableWithName: (name) ->
    if @aliasOf?
      context = new Context()
      aliasOf = @aliasOf.replace('%name%',name)
      aliased = @_aliasedFromFinder(context.getFinder(aliasOf))
      if aliased?
        return aliased.init().isExecutable()
      return false
    return @isExecutable()
  resultIsAvailable: ->
    aliased = @getAliased()
    if aliased?
      return aliased.resultIsAvailable()
    for p in ['resultStr','resultFunct']
      if this[p]?
        return true
    return false
  getDefaults: ->
    res = {}
    aliased = @getAliased()
    if aliased?
      res = Object.assign(res,aliased.getDefaults())
    res = Object.assign(res,@defaults)
    return res
  _aliasedFromFinder: (finder) ->
      finder.useFallbacks = false
      finder.mustExecute = false
      finder.useDetectors = false
      return finder.find()
  getAliased: ->
    if @aliasOf?
      context = new Context()
      return @_aliasedFromFinder(context.getFinder(@aliasOf))
  setOptions: (data) ->
    for key, val of data
      if key of @defaultOptions
        @options[key] = val
  _optionsForAliased: (aliased) ->
    opt = {}
    opt = Object.assign(opt,@defaultOptions)
    if aliased?
      opt = Object.assign(opt,aliased.getOptions())
    return Object.assign(opt,@options)
  getOptions: ->
    return @_optionsForAliased(@getAliased())
  getOption: (key) ->
    options = @getOptions()
    if key of options
      return options[key]
  help: ->
    cmd = @getCmd('help')
    if cmd?
      return cmd.init().resultStr
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
    return cmd
  removeCmd: (cmd) ->
    if (i = @cmds.indexOf(cmd)) > -1
      @cmds.splice(i, 1)
    return cmd
  getCmd: (fullname) ->
    @init()
    [space,name] = NamespaceHelper.splitFirst(fullname)
    if space?
      return @getCmd(space)?.getCmd(name)
    for cmd in @cmds
      if cmd.name == name
        return cmd
  setCmdData: (fullname,data) ->
    @setCmd(fullname,new Command(fullname.split(':').pop(),data))
  setCmd: (fullname,cmd) ->
    [space,name] = NamespaceHelper.splitFirst(fullname)
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
    
  @providers = []

  @storage = new Storage()

  @initCmds: ->
    Command.cmds = new Command(null,{
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
    for provider in @providers
      provider.register(Command.cmds)

  @saveCmd: (fullname, data) ->
    Promise.resolve().then =>
      Command.cmds.setCmdData(fullname,data)
    .then =>
      @storage.saveInPath('cmds', fullname, data)

  @loadCmds: ->
    Promise.resolve().then =>
      savedCmds = @storage.load('cmds')
    .then (savedCmds)=>
      if savedCmds? 
        for fullname, data of savedCmds
          Command.cmds.setCmdData(fullname, data)

  @resetSaved: ->
    @storage.save('cmds',{})

  @makeVarCmd = (name,base={}) -> 
    base.execute = (instance) ->
      val = if (p = instance.getParam(0))?
        p
      else if instance.content
        instance.content
      instance.codewave.vars[name] = val if val?
    return base

  @makeBoolVarCmd = (name,base={}) -> 
    base.execute = (instance) ->
      val = if (p = instance.getParam(0))?
        p
      else if instance.content
        instance.content
      unless val? and val in ['0','false','no']
        instance.codewave.vars[name] = true
    return base
  

export class BaseCommand
  constructor: (@instance) ->
  init: ->
    #
  resultIsAvailable: ->
    return this["result"]?
  getDefaults: ->
    return {}
  getOptions: ->
    return {}
      