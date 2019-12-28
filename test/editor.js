'use strict';

(function () {
  describe('Editor', function () {
    beforeEach(function () {
      createTextArea('Editor')
      Codewave.logger.enabled = false
      return this.codewave = Codewave.detect('Editor')
    })
    afterEach(function () {
      delete this.codewave
      return removeTextArea('Editor')
    })
    it('should set cursor pos', function () {
      this.codewave.editor.text('lorem')
      this.codewave.editor.setCursorPos(2)
      expect(this.codewave.editor.getCursorPos()).to.respondTo('raw')
      return expect(this.codewave.editor.getCursorPos().raw()).to.eql([2, 2])
    })
  })
}).call(null)
