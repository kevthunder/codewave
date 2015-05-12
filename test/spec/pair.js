(function() {
  describe('Pair', function() {
    beforeEach(function() {
      return this.pair = null;
    });
    afterEach(function() {
      return delete this.pair;
    });
    it('should find next opening', function() {
      var res, text;
      this.pair = new Codewave.util.Pair('1', '2');
      text = "abc 1 2 1 2";
      res = this.pair.matchAny(text);
      expect(res).to.exist;
      expect(res.start()).to.eql(4);
      return expect(res.name()).to.eql('opener');
    });
    it('should find after offset', function() {
      var res, text;
      this.pair = new Codewave.util.Pair('1', '2');
      text = "abc 1 2 1 2";
      res = this.pair.matchAny(text, 5);
      expect(res).to.exist;
      expect(res.start()).to.eql(6);
      return expect(res.name()).to.eql('closer');
    });
    it('should find next regexp opening', function() {
      var res, text;
      this.pair = new Codewave.util.Pair(/\d/, /\$/);
      text = "abc 1 $ 1 $";
      res = this.pair.matchAny(text);
      expect(res).to.exist;
      expect(res.start()).to.eql(4);
      return expect(res.name()).to.eql('opener');
    });
    it('should find last closing', function() {
      var res, text;
      this.pair = new Codewave.util.Pair('1', '2');
      text = "abc 1 2 1 2";
      res = this.pair.matchAnyLast(text);
      expect(res).to.exist;
      expect(res.start()).to.eql(10);
      return expect(res.name()).to.eql('closer');
    });
    it('should find last regexp closing', function() {
      var res, text;
      this.pair = new Codewave.util.Pair(/\d/, /\$/);
      text = "abc 1 $ 1 $";
      res = this.pair.matchAnyLast(text);
      expect(res).to.exist;
      expect(res.start()).to.eql(10);
      return expect(res.name()).to.eql('closer');
    });
    it('should match text openner and closer', function() {
      var res, text;
      this.pair = new Codewave.util.Pair('((', '))');
      text = "abc (( def )) end";
      res = this.pair.wrapperPos(new Codewave.util.Pos(8), text);
      expect(res).to.exist;
      return expect(res.raw()).to.eql([4, 13]);
    });
    it('should return null on no match', function() {
      var res, text;
      this.pair = new Codewave.util.Pair('((', '))');
      text = "abc (( def ) end";
      res = this.pair.wrapperPos(new Codewave.util.Pos(8), text);
      return expect(res).to.not.exist;
    });
    it('should match regexp openner and closer', function() {
      var res, text;
      this.pair = new Codewave.util.Pair(/#+-+/, /-+#+/);
      text = "abc ##-- def --## end";
      res = this.pair.wrapperPos(new Codewave.util.Pos(10), text);
      expect(res).to.exist;
      return expect(res.raw()).to.eql([4, 17]);
    });
    it('should match identical openner and closer', function() {
      var res, text;
      this.pair = new Codewave.util.Pair('##', '##');
      text = "abc ## def ## end";
      res = this.pair.wrapperPos(new Codewave.util.Pos(8), text);
      expect(res).to.exist;
      return expect(res.raw()).to.eql([4, 13]);
    });
    it('should match identical regexp openner and closer', function() {
      var res, text;
      this.pair = new Codewave.util.Pair(/##/, /##/);
      text = "abc ## def ## end";
      res = this.pair.wrapperPos(new Codewave.util.Pos(8), text);
      expect(res).to.exist;
      return expect(res.raw()).to.eql([4, 13]);
    });
    it('should match with optionnal close', function() {
      var res, text;
      this.pair = new Codewave.util.Pair('((', '))', {
        optionnal_end: true
      });
      text = "abc (( def end";
      res = this.pair.wrapperPos(new Codewave.util.Pos(8), text);
      expect(res).to.exist;
      return expect(res.raw()).to.eql([4, 14]);
    });
    return it('should allow match validation', function() {
      var res, text;
      this.pair = new Codewave.util.Pair(/#+-+/, /-+#+/, {
        validMatch: function(match) {
          console.log(match, match.length());
          return match.length() < 6;
        }
      });
      text = "abc ##-- def ---### --## end";
      res = this.pair.wrapperPos(new Codewave.util.Pos(10), text);
      expect(res).to.exist;
      return expect(res.raw()).to.eql([4, 24]);
    });
  });

}).call(this);

//# sourceMappingURL=pair.js.map
