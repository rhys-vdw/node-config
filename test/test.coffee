assert = require 'assert'
config = null

describe 'config', ->

  it 'Should find the correct folder', ->
    try
      config = require('../lib/index')(path: 'test/config')
    catch e
      assert.fail(e, 'success', 'Couldnt find the folder', 'require')

  it 'Should recursively return config objects', ->
    testConfig = config.get('test')
    assert.equal testConfig.path(), 'test', 'Incorrect path in config object'
    assert.equal testConfig.get('nested').path(), 'test.nested', 'Incorrect path in nested object'

  it 'Should return values present in example file', ->
    assert.deepEqual config.get('test.anArray'), [0,1,2,3]
    assert.equal config.get('test.fiftyFour'), 54
    assert.equal config.get('test.aString'), 'Hello, World!'
    assert.equal config.get('test.nested.aValue'), 'testerly'

  it 'Should see values overriden by .local files', ->
    assert.equal config.get('test.override'), true
