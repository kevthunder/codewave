fs = require('fs');
util = require('util');

export class FileStorageEngine
  constructor: (@file) ->
  save: (key,val) ->
    @readFile().catch ->
      return {}
    .then (content)->
      parts = key.split('.')
      last = parts.pop()
      cur = content
      for part in parts
        if typeof cur[part] != "object"
          cur = cur[part] = {}
        else
          cur = cur[part]
      cur[last] = val
      @writeFile(content)
  load: (key) ->
    @readFile().then (content)->
      parts = key.split('.')
      cur = content
      for part in parts
        if typeof cur[part] == "undefined"
          return undefined
        else
          cur = cur[part]
  readFile: ()->
    util.promisify(fs.readFile(@file)).then (raw)->
      JSON.parse(raw)
  writeFile: (@content)->
    util.promisify(fs.writeFile(@file, JSON.stringify(@content)))