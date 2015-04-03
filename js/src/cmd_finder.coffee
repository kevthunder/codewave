# [pawa]
#   replace Codewave.CmdFinder CmdFinder

class @Codewave.CmdFinder
  constructor: (names, options) ->
    # Codewave.logger.toMonitor(this,'findIn')
    # Codewave.logger.toMonitor(this,'triggerDetectors')
    if typeof names == 'string'
      names = [names]
    defaults = {
      parent: null
      namespaces: []
      parentContext: null
      context: null
      root: Codewave.Command.cmds
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
      @context = new Codewave.Context(@codewave)
    if @parentContext?
      @context.parent = @parentContext
    if @namespaces?
      @context.addNamespaces(@namespaces)
  find: ->
    @triggerDetectors()
    @cmd = @findIn(@root)
    return @cmd
  getPosibilities: ->
    @triggerDetectors()
    path = list(@path)
    return @findPosibilitiesIn(@root,path)
  getNamesWithPaths: ->
    paths = {}
    for name in @names 
      [space,rest] = Codewave.util.splitFirstNamespace(name)
      if space? and !(space in @context.getNameSpaces())
        unless space of paths 
          paths[space] = []
        paths[space].push(rest)
    return paths
  applySpaceOnNames: (namespace) ->
    [space,rest] = Codewave.util.splitFirstNamespace(namespace,true)
    @names.map( (name) ->
      [cur_space,cur_rest] = Codewave.util.splitFirstNamespace(name)
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
      posibilities = new Codewave.CmdFinder(@context.getNameSpaces(), {parent: this, mustExecute: false, useFallbacks: false}).findPosibilities()
      i = 0
      while i < posibilities.length
        cmd = posibilities[i]
        for detector in cmd.detectors 
          res = detector.detect(this)
          if res?
            @context.addNamespaces(res)
            posibilities = posibilities.concat(new Codewave.CmdFinder(res, {parent: this, mustExecute: false, useFallbacks: false}).findPosibilities())
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
    for space, names of @getNamesWithPaths()
      next = @getCmdFollowAlias(space)
      if next? 
        posibilities = posibilities.concat(new Codewave.CmdFinder(names, {parent: this, root: next}).findPosibilities())
    for nspc in @context.getNameSpaces()
      [nspcName,rest] = Codewave.util.splitFirstNamespace(nspc,true)
      next = @getCmdFollowAlias(nspcName)
      if next? 
        posibilities = posibilities.concat(new Codewave.CmdFinder(@applySpaceOnNames(nspc), {parent: this, root: next}).findPosibilities())
    for name in @getDirectNames()
      direct = @root.getCmd(name)
      if @cmdIsValid(direct)
        posibilities.push(direct)
    if @useFallbacks
      fallback = @root.getCmd('fallback')
      if @cmdIsValid(fallback)
        posibilities.push(fallback)
    return posibilities
  getCmdFollowAlias: (name) ->
    cmd = @root.getCmd(name)
    if cmd? 
      cmd.init()
      if cmd.aliasOf?
        return cmd.getAliased()
    return cmd
  cmdIsValid: (cmd) ->
    unless cmd?
      return false
    cmd.init()
    return !@mustExecute or cmd.isExecutable()
  bestInPosibilities: (poss) ->
    if poss.length > 0
      best = null
      bestScore = null
      for p in poss
        score = p.depth
        if p.name == 'fallback' 
            score -= 1000
        if best is null or score >= bestScore
          bestScore = score
          best = p
      return best;