fs = require('fs')
util = require('util');
path = require('path');

export class FileStorageEngine
  constructor: (@file) ->

  save: (key, val) ->
    @readFile().catch =>
      return {}
    .then (content)=>
      content[key] = val
      @writeFile(content)

  saveInPath: (path, key, val) ->
    @readFile().catch =>
      return {}
    .then (content)=>
      parts = path.split('.')
      cur = content
      for part in parts
        if typeof cur[part] != "object"
          cur = cur[part] = {}
        else
          cur = cur[part]
      cur[key] = val
      @writeFile(content)

  load: (key) ->
    @readFile().then (content)=>
      content[key]
    .catch =>
      undefined

  loadInPath: (path, key) ->
    @readFile().then (content)=>
      parts = path.split('.')
      parts.push(key)
      cur = content
      for part in parts
        if typeof cur[part] == "undefined"
          return undefined
        else
          cur = cur[part]

  readFile: ()->
    util.promisify(fs.readFile)(@file).then (raw)=>
      JSON.parse(raw)

  writeFile: (@content)->
    @checkFolder(@file).then =>
      util.promisify(fs.writeFile)(@file, JSON.stringify(@content))

  deleteFile: ->
    util.promisify(fs.unlink)(@file)

  checkFolder: (filePath) ->
    dirname = path.dirname(filePath)
    util.promisify(fs.exists)(dirname).then (exists)=>
      unless exists
        @checkFolder(dirname).then =>
          util.promisify(fs.mkdir)(dirname)
