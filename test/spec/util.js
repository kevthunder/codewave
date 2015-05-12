(function() {
  describe('Util', function() {
    beforeEach(function() {});
    afterEach(function() {});
    it('should repeat string', function() {
      return expect(Codewave.util.repeat('+-', 3)).to.eql('+-+-+-');
    });
    it('should repeat string to length', function() {
      return expect(Codewave.util.repeatToLength('+-', 3)).to.eql('+-+');
    });
    return it('should reverse string', function() {
      return expect(Codewave.util.reverseStr('abcd')).to.eql('dcba');
    });
  });

}).call(this);

//# sourceMappingURL=util.js.map
