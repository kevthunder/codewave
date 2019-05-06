export class StringHelper
  @trimEmptyLine: (txt) ->
    return txt.replace(/^\s*\r?\n/, '').replace(/\r?\n\s*$/, '')

  @escapeRegExp: (str) ->
    str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")

  @repeatToLength: (txt, length) ->
    return '' if length <= 0
    Array(Math.ceil(length/txt.length)+1).join(txt).substring(0,length)
    
  @repeat: (txt, nb) ->
    Array(nb+1).join(txt)
    
  @getTxtSize: (txt) ->
    lines = txt.replace(/\r/g,'').split("\n")  # [pawa python] replace '/\r/g' "'\r'"
    w = 0
    for l in lines
      w = Math.max(w,l.length)
    return new Size(w,lines.length-1)

  @indentNotFirst: (text,nb=1,spaces='  ') ->
    if text?
      reg = /\n/g  # [pawa python] replace '/\n/g' "re.compile(r'\n',re.M)"
      return text.replace(reg, "\n" + @repeat(spaces, nb))
    else
      return text
      
  @indent: (text,nb=1,spaces='  ') ->
    if text?
      return spaces + @indentNotFirst(text,nb,spaces)
    else
      return text
  
  @reverseStr: (txt) ->
    return txt.split("").reverse().join("")
  
  
  @removeCarret: (txt, carretChar = '|') ->
    tmp = '[[[[quoted_carret]]]]'
    reCarret = new RegExp(@escapeRegExp(carretChar), "g")
    reQuoted = new RegExp(@escapeRegExp(carretChar+carretChar), "g")
    reTmp = new RegExp(@escapeRegExp(tmp), "g")
    txt.replace(reQuoted,tmp).replace(reCarret,'').replace(reTmp, carretChar)
    
  @getAndRemoveFirstCarret: (txt, carretChar = '|') ->
    pos = @getCarretPos(txt,carretChar)
    if pos?
      txt = txt.substr(0,pos) + txt.substr(pos+carretChar.length)
      return [pos,txt]
      
  @getCarretPos: (txt, carretChar = '|') ->
    reQuoted = new RegExp(@escapeRegExp(carretChar+carretChar), "g")
    txt = txt.replace(reQuoted, ' ') # [pawa python] replace reQuoted carretChar+carretChar
    if (i = txt.indexOf(carretChar)) > -1
      return i