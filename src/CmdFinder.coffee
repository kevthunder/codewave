import { Context } from './Context';
import { NamespaceHelper } from './helpers/NamespaceHelper';
import { Command } from './Command';

export class CmdFinder
  constructor: (names, options) ->
    if typeof names == 'string'
      names = [names]
    defaults = {
      parent: null
      namespaces: []
      parentContext: null
      context: null
      root: Command.cmds
      mustExecute: true
      useDetectors: true
      useFallbacks: true
      instance: null
      codewave: null
    }
    @names = names
    @parent = options['parent']
    for key, val of defaults
      if key of options
        this[key] = options[key]
      else if @parent? and key != 'parent'
        this[key] = @parent[key]
      else
        this[key] = val
    unless @context?
      @context = new Context(@codewave)
    if @parentContext?
      @context.parent = @parentContext
    if @namespaces?
      @context.addNamespaces(@namespaces)
  find: ->
    @triggerDetectors()
    @cmd = @findIn(@root)
    return @cmd
#  getPosibilities: ->
#    @triggerDetectors()
#    path = list(@path)
#    return @findPosibilitiesIn(@root,path)
  getNamesWithPaths: ->
    paths = {}
    for name in @names 
      [space,rest] = NamespaceHelper.splitFirst(name)
      if space? and !(space in @context.getNameSpaces())
        unless space of paths 
          paths[space] = []
        paths[space].push(rest)
    return paths
  applySpaceOnNames: (namespace) ->
    [space,rest] = NamespaceHelper.splitFirst(namespace,true)
    @names.map( (name) ->
      [cur_space,cur_rest] = NamespaceHelper.splitFirst(name)
      if cur_space? and cur_space == space
        name = cur_rest
      if rest?
        name = rest + ':' + name
      return name
    )
  getDirectNames: ->
    return (n for n in @names when n.indexOf(":") == -1)
  triggerDetectors: ->
    if @useDetectors 
      @useDetectors = false
      posibilities = new CmdFinder(@context.getNameSpaces(), {parent: this, mustExecute: false, useFallbacks: false}).findPosibilities()
      i = 0
      while i < posibilities.length
        cmd = posibilities[i]
        for detector in cmd.detectors 
          res = detector.detect(this)
          if res?
            @context.addNamespaces(res)
            posibilities = posibilities.concat(new CmdFinder(res, {parent: this, mustExecute: false, useFallbacks: false}).findPosibilities())
        i++
  findIn: (cmd,path = null) ->
    unless cmd?
      return null
    best = @bestInPosibilities(@findPosibilities())
    if best?
      return best
  findPosibilities: ->
    unless @root?
      return []
    @root.init()
    posibilities = []
    if @codewave?.inInstance?.cmd == @root
      posibilities = posibilities.concat(@getPosibilitiesFromCommand('in_instance'))
    for space, names of @getNamesWithPaths()
      posibilities = posibilities.concat(@getPosibilitiesFromCommand(space, names))
    for nspc in @context.getNameSpaces()
      [nspcName,rest] = NamespaceHelper.splitFirst(nspc,true)
      posibilities = posibilities.concat(@getPosibilitiesFromCommand(nspcName, @applySpaceOnNames(nspc)))
    for name in @getDirectNames()
      direct = @root.getCmd(name)
      if @cmdIsValid(direct)
        posibilities.push(direct)
    if @useFallbacks
      fallback = @root.getCmd('fallback')
      if @cmdIsValid(fallback)
        posibilities.push(fallback)
    @posibilities = posibilities
    return posibilities
  getPosibilitiesFromCommand: (cmdName, names = @names) ->
    posibilities = [];
    nexts = @getCmdFollowAlias(cmdName)
    for next in nexts
      posibilities = posibilities.concat(new CmdFinder(names, {parent: this, root: next}).findPosibilities())
    posibilities
  getCmdFollowAlias: (name) ->
    cmd = @root.getCmd(name)
    if cmd? 
      cmd.init()
      if cmd.aliasOf?
        return [cmd,cmd.getAliased()]
      return [cmd]
    return [cmd]
  cmdIsValid: (cmd) ->
    unless cmd?
      return false
    if cmd.name != 'fallback' && cmd in @ancestors()
      return false
    return !@mustExecute or @cmdIsExecutable(cmd)
  ancestors: ->
    if @codewave?.inInstance?
      return @codewave.inInstance.ancestorCmdsAndSelf()
    return []
  cmdIsExecutable: (cmd) ->
    names = @getDirectNames()
    if names.length == 1
      return cmd.init().isExecutableWithName(names[0])
    else
      return cmd.init().isExecutable()
  cmdScore: (cmd) ->
    score = cmd.depth
    if cmd.name == 'fallback' 
        score -= 1000
    return score
  bestInPosibilities: (poss) ->
    if poss.length > 0
      best = null
      bestScore = null
      for p in poss
        score = @cmdScore(p)
        if !best? or score >= bestScore
          bestScore = score
          best = p
      return best;