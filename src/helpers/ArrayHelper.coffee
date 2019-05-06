export class ArrayHelper
  @isArray: (arr) ->
    return Object.prototype.toString.call( arr ) == '[object Array]'
  
  @union: (a1,a2) ->
    @unique(a1.concat(a2))
    
  @unique: (array) ->
    a = array.concat()
    i = 0
    while i < a.length
      j = i + 1
      while j < a.length
        if a[i] == a[j]
          a.splice(j--, 1)
        ++j
      ++i
    a