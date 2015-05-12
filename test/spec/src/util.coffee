describe 'Util', ->
  beforeEach ->
    
  afterEach ->

  it 'should repeat string', ->
    expect(Codewave.util.repeat('+-',3)).to.eql('+-+-+-')
    
  it 'should repeat string to length', ->
    expect(Codewave.util.repeatToLength('+-',3)).to.eql('+-+')
    
  it 'should reverse string', ->
    expect(Codewave.util.reverseStr('abcd')).to.eql('dcba')
    