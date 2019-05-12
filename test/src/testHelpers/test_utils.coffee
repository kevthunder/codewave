
import {expect} from 'chai'
import {Pos} from '../../lib/positioning/Pos'

export assertEditorResult = (editor,res)->
  [realText,sels] = extractSelections(res)
  expect(editor.text()).to.eql(realText)
  if sels.length
    if editor.allowMultiSelection()
      expect( editor.getMultiSel().map((s)->s.raw()) ).to.eql( sels.map((s)->s.raw()) )
    else
      expect(editor.getCursorPos().raw()).to.eql(sels[0].raw())
  
export setEditorContent = (editor,val)->
  [realText,sels] = extractSelections(val)
  if sels.length
    if editor.allowMultiSelection()
      editor.setMultiSel(sels)
    else
      editor.setCursorPos(sels[0].start,sels[0].end)
  editor.text(realText)

export extractSelections = (text)->
  sels = []
  finalText = text
  while true
    if match = finalText.match(/\|\[(.*)\]/)
      sels.push(new Pos(match.index,match.index+match[1].length))
      finalText = finalText.replace(/\|\[(.*)\]/,'$1')
    else if (pos = finalText.indexOf('|')) > -1
      sels.push(new Pos(pos))
      finalText = finalText.replace('|','')
    else
      break
  return [finalText,sels]

    
export createTextArea = (id) ->
  area = document.createElement('textarea')
  area.id = id
  document.body.appendChild(area);
  
export removeTextArea = (id) ->
  area = document.getElementById(id)
  area.parentElement.removeChild(area);
  