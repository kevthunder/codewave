fs = require('fs')
util = require('util');
path = require('path');

export class LocalFiles
  constructor: (@root) ->

  realpath: (file)->
    path.normalize(@root + path.normalize('/' + file))

  readFile: (file)->  
    realpath = @realpath(file)
    util.promisify(fs.readFile)(realpath).then (raw)=>
      raw.toString()

  writeFile: (file, content)->
    realpath = @realpath(file)
    @checkFolder(realpath).then =>
      util.promisify(fs.writeFile)(realpath, content)

  deleteFile: (file)->
    realpath = @realpath(file)
    util.promisify(fs.unlink)(realpath)

  checkFolder: (filePath) ->
    dirname = path.dirname(filePath)
    util.promisify(fs.exists)(dirname).then (exists)=>
      unless exists
        @checkFolder(dirname).then =>
          util.promisify(fs.mkdir)(dirname)
