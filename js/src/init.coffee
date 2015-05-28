Codewave.instances = []
Codewave.detect = (target) ->
  cw = new Codewave(new Codewave.TextAreaEditor(target))
  Codewave.instances.push(cw)
  cw
  