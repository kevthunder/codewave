@Codewave.storage = new class
  constructor: () ->
  save: (key,val) ->
    localStorage.setItem(@fullKey(key), JSON.stringify(val))
  load: (key) ->
    JSON.parse(localStorage.getItem(@fullKey(key)))
  fullKey: (key) ->
    'CodeWave_'+key