describe 'BoxHelper', ->
  beforeEach ->
    @boxHelper = null
    @codewave = null
    
  afterEach ->
    delete @boxHelper
    delete @codewave
    
  it 'should detect box position', ->
    [text,sels] = extractSelections(
      """Lorem ipsum dolor
         |<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
         <!-- ~  |Lorem ipsum dolor                     ~ -->
         <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->|
         Lorem ipsum dolor""")
    @codewave = new Codewave(new Codewave.TextParser(text))
    @boxHelper = new Codewave.util.BoxHelper(@codewave.context)
    expect(@boxHelper.getBoxForPos(sels[1]).raw()).to.eql([sels[0].start,sels[2].start])
    
  it 'should detect box position when nested', ->
    [text,sels] = extractSelections(
      """Lorem ipsum dolor
         <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
         <!-- ~  |<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~ -->    ~ -->
         <!-- ~  <!-- ~  |Lorem ipsum dolor    ~ -->    ~ -->
         <!-- ~  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~ -->|    ~ -->
         <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
         Lorem ipsum dolor""")
    @codewave = new Codewave(new Codewave.TextParser(text))
    @boxHelper = new Codewave.util.BoxHelper(@codewave.context)
    expect(@boxHelper.getBoxForPos(sels[1]).raw()).to.eql([sels[0].start,sels[2].start])
    
    
  it 'should detect box width', ->
    @codewave = new Codewave(new Codewave.TextParser(''))
    @boxHelper = new Codewave.util.BoxHelper(@codewave.context)
    @boxHelper.getOptFromLine('<!-- ~  123456789  ~ -->',false)
    expect(@boxHelper).property('width', 9)
    
    
  it 'should detect nested box outer width', ->
    @codewave = new Codewave(new Codewave.TextParser(''))
    @boxHelper = new Codewave.util.BoxHelper(@codewave.context)
    @boxHelper.getOptFromLine('<!-- ~  <!-- ~  123456789  ~ -->  ~ -->',false)
    expect(@boxHelper).property('width', 24)