
export class LocalStorageEngine
  constructor: () ->
  save: (key,val) ->
    if localStorage?
      localStorage.setItem(@fullKey(key), JSON.stringify(val))
  saveInPath: (path, key, val) ->
    data = @load(path)
    unless data?
      data = {}
    data[key] = val
    @save(path,data)
  load: (key) ->
    if localStorage?
      JSON.parse(localStorage.getItem(@fullKey(key)))
  fullKey: (key) ->
    'CodeWave_'+key