@assertEditorResult = (editor,res)->
  [realText,sels] = extractSelections(res)
  expect(editor.text()).to.eql(realText)
  if sels.length
    if editor.allowMultiSelection()
      expect( editor.getMultiSel().map((s)->s.raw()) ).to.eql( sels.map((s)->s.raw()) )
    else
      expect(editor.getCursorPos().raw()).to.eql(sels[0].raw())
  
@setEditorContent = (editor,val)->
  [realText,sels] = extractSelections(val)
  if sels.length
    if editor.allowMultiSelection()
      editor.setMultiSel(sels)
    else
      editor.setCursorPos(sels[0].start,sels[0].end)
  editor.text(realText)

@extractSelections = (text)->
  sels = []
  finalText = text
  while true
    if match = finalText.match(/\|\[(.*)\]/)
      sels.push(new Codewave.util.Pos(match.index,match.index+match[1].length))
      finalText = finalText.replace(/\|\[(.*)\]/,'$1')
    else if (pos = finalText.indexOf('|')) > -1
      sels.push(new Codewave.util.Pos(pos))
      finalText = finalText.replace('|','')
    else
      break
  return [finalText,sels]

  
unless Function::bind?
  Function::bind = (thisp) ->
    =>
      @apply thisp, arguments
    
@createTextArea = (id) ->
  area = document.createElement('textarea')
  area.id = id
  document.body.appendChild(area);
  
@removeTextArea = (id) ->
  area = document.getElementById(id)
  area.parentElement.removeChild(area);
  

initCmds = ->
  test = Codewave.Command.cmds.addCmd(new Codewave.Command('test'))
  test.addCmds({
    'replace_box': {
      'replaceBox' : true,
      'result' : '~~box~~Lorem ipsum~~/box~~'
    }
  })
  
Codewave.Command.cmdInitialisers.push(initCmds)
