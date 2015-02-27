class @Codewave.CmdFinder
	constructor: (names, options) ->
		if typeof spaces == 'string'
			names = [names]
		defaults = {
      parent : null
			namespaces: []
			root: command.cmds
			mustExecute: true
			useDetectors: true
			useFallbacks: true
			instance: null
			codewave: null
		}
		@names = names
		@parent = options['parent']
		for key, val in defaults
			if key in options
				this[key] = options[key]
			else if parent? and key != 'parent'
				this[key] = parent[key]
			else
				self[key] = val
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
			if space? and !space in @namespaces
				unless space in paths 
					paths[space] = []
				paths[space].push(rest)
		return paths
	applySpaceOnNames: (space) ->
    [space,rest] = Codewave.util.splitFirstNamespace(name)
		@names.map( (name) ->
      [cur_space,cur_rest] = Codewave.util.splitFirstNamespace(name)
      if cur_space? and cur_space == space
        name = cur_rest
      if space?
        name = rest + ':' + name
      return name
    )
	getDirectNames: ->
		return (n for n in @names when n.indexOf(":") == -1)
	triggerDetectors: ->
		if @useDetectors 
			@useDetectors = false
			posibilities = new Codewave.CmdFinder(@namespaces,{parent: this,mustExecute: false,useFallbacks: false}).findPosibilities()
			for cmd in posibilities 
				for detector in cmd.detectors 
					res = detector.detect(this)
					@addNamespaces(res)
	addNamespaces: (spaces) ->
		if spaces 
			if typeof spaces == 'string'
				spaces = [spaces]
			for space in spaces 
				if space not in @namespaces 
					@namespaces.append(space)
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
		for space, names in @getNamesWithPaths()
			next = @root.getCmd(space)
			if next? 
				posibilities = Codewave.util.merge(posibilities,new Codewave.CmdFinder(names, {parent: this, root: next}).findPosibilities())
		for nspc in @namespaces
			nspcPath = nspc.split(":");
			nspcName = nspcPath.pop(0)
			next = @root.getCmd(nspcName)
			if next? 
				posibilities = Codewave.util.merge(posibilities,new Codewave.CmdFinder(@applySpaceOnNames(nspc), {parent: this, root: next}).findPosibilities())
		for name in @getDirectNames()
			direct = @root.getCmd(name)
			if @cmdIsValid(direct)
				posibilities.push(direct)
		if @useFallbacks
			fallback = @root.getCmd('fallback')
			if @cmdIsValid(fallback)
				posibilities.push(fallback)
		return posibilities
	cmdIsValid: (cmd) ->
		unless cmd?
			return false
		cmd.init()
		return !@mustExecute or cmd.isExecutable()
	bestInPosibilities: (poss) ->
		if len(poss) > 0
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