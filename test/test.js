(function() {
  var assert, config;

  assert = require('assert');

  config = require('../lib/index');

  describe('config', function() {
    it('Should fail when not initialized', function() {
      var e;
      try {
        config.get('test');
        assert.fail(e, 'exception', 'Managed to call `get` when not initialized', 'get');
      } catch (_error) {
        e = _error;
      }
      try {
        config.path();
        return assert.fail(e, 'exception', 'Managed to call `path` when not initialized', 'path');
      } catch (_error) {
        e = _error;
      }
    });
    it('Should find the correct folder when initialized', function() {
      var e;
      try {
        return config.initialize({
          path: 'test/config'
        });
      } catch (_error) {
        e = _error;
        return assert.fail(e, 'initialization', 'Couldnt find the folder', 'initialize');
      }
    });
    it('Should fail when initialized twice', function() {
      var e;
      try {
        config.initialize({
          path: 'test/config'
        });
        return assert.fail(e, 'initialization', 'Initialized twice', 'initialize');
      } catch (_error) {
        e = _error;
      }
    });
    it('Should recursively return config objects', function() {
      var testConfig;
      testConfig = config.get('test');
      assert.equal(testConfig.path(), 'test', 'Incorrect path in config object');
      return assert.equal(testConfig.get('nested').path(), 'test.nested', 'Incorrect path in nested object');
    });
    it('Should return values present in example file', function() {
      assert.deepEqual(config.get('test.anArray'), [0, 1, 2, 3]);
      assert.equal(config.get('test.fiftyFour'), 54);
      assert.equal(config.get('test.aString'), 'Hello, World!');
      return assert.equal(config.get('test.nested.aValue'), 'testerly');
    });
    return it('Should see values overriden by .local files', function() {
      return assert.equal(config.get('test.override'), true);
    });
  });

}).call(this);
