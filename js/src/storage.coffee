@Codewave.storage = new class
  constructor: () ->
  save: (key,val) ->
    console.log(JSON.stringify(val))
    console.log(localStorage.setItem(@fullKey(key), JSON.stringify(val)))
  load: (key) ->
    JSON.parse(localStorage.getItem(@fullKey(key)))
  fullKey: (key) ->
    'CodeWave_'+key