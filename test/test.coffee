assert = require 'assert'
config = require('../lib/index')

describe 'config', ->

  it 'Should fail when not initialized', ->
    try
      config.get 'test'
      assert.fail(e, 'exception', 'Managed to call `get` when not initialized', 'get')
    catch e

    try
      config.path()
      assert.fail(e, 'exception', 'Managed to call `path` when not initialized', 'path')
    catch e

  it 'Should find the correct folder when initialized', ->
    try
      config.initialize path: 'test/config'
    catch e
      assert.fail(e, 'initialization', 'Couldnt find the folder', 'initialize')

  it 'Should fail when initialized twice', ->
    try
      config.initialize path: 'test/config'
      assert.fail(e, 'initialization', 'Initialized twice', 'initialize')
    catch e

  it 'Should recursively return config objects', ->
    testConfig = config.get('test')
    assert.equal testConfig.path(), 'test', 'Incorrect path in config object'
    assert.equal testConfig.get('nested').path(), 'test.nested', 'Incorrect path in nested object'

  it 'Should return raw config objects', ->
    testConfig = config.get('test')
    nested = "aValue": "testerly"
    assert.deepEqual testConfig.get('nested', true), nested, '`get` with raw flag failed'
    assert.deepEqual testConfig.getRaw('nested'), nested, '`getRaw` failed'

  it 'Should return values present in example file', ->
    assert.deepEqual config.get('test.anArray'), [0,1,2,3]
    assert.equal config.get('test.fiftyFour'), 54
    assert.equal config.get('test.aString'), 'Hello, World!'
    assert.equal config.get('test.nested.aValue'), 'testerly'

  it 'Should see values overriden by .local files', ->
    assert.equal config.get('test.override'), true
