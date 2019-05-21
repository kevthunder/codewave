
export class LocalStorageEngine
  constructor: () ->
  save: (key,val) ->
    if localStorage?
      localStorage.setItem(@fullKey(key), JSON.stringify(val))
  load: (key) ->
    if localStorage?
      JSON.parse(localStorage.getItem(@fullKey(key)))
  fullKey: (key) ->
    'CodeWave_'+key