"use strict";

(function () {
  describe('BoxHelper', function () {
    beforeEach(function () {
      this.boxHelper = null;
      return this.codewave = null;
    });
    afterEach(function () {
      delete this.boxHelper;
      return delete this.codewave;
    });
    it('should detect box position', function () {
      var sels, text;
      [text, sels] = extractSelections("Lorem ipsum dolor\n|<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->\n<!-- ~  |Lorem ipsum dolor                     ~ -->\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->|\nLorem ipsum dolor");
      this.codewave = new Codewave(new Codewave.TextParser(text));
      this.boxHelper = new Codewave.util.BoxHelper(this.codewave.context);
      return expect(this.boxHelper.getBoxForPos(sels[1]).raw()).to.eql([sels[0].start, sels[2].start]);
    });
    it('should detect box position when nested', function () {
      var sels, text;
      [text, sels] = extractSelections("Lorem ipsum dolor\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->\n<!-- ~  |<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~ -->    ~ -->\n<!-- ~  <!-- ~  |Lorem ipsum dolor    ~ -->    ~ -->\n<!-- ~  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~ -->|    ~ -->\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->\nLorem ipsum dolor");
      this.codewave = new Codewave(new Codewave.TextParser(text));
      this.boxHelper = new Codewave.util.BoxHelper(this.codewave.context);
      return expect(this.boxHelper.getBoxForPos(sels[1]).raw()).to.eql([sels[0].start, sels[2].start]);
    });
    it('should detect box width', function () {
      this.codewave = new Codewave(new Codewave.TextParser(''));
      this.boxHelper = new Codewave.util.BoxHelper(this.codewave.context);
      this.boxHelper.getOptFromLine('<!-- ~  123456789  ~ -->', false);
      return expect(this.boxHelper).property('width', 9);
    });
    return it('should detect nested box outer width', function () {
      this.codewave = new Codewave(new Codewave.TextParser(''));
      this.boxHelper = new Codewave.util.BoxHelper(this.codewave.context);
      this.boxHelper.getOptFromLine('<!-- ~  <!-- ~  123456789  ~ -->  ~ -->', false);
      return expect(this.boxHelper).property('width', 24);
    });
  });
}).call(void 0);
//# sourceMappingURL=maps/box_helper.js.map
