(function() {
  var assert, config;

  assert = require('assert');

  config = null;

  describe('config', function() {
    it('Should find the correct folder', function() {
      var e;
      try {
        return config = require('../lib/index')({
          path: 'test/config'
        });
      } catch (_error) {
        e = _error;
        return assert.fail(e, 'success', 'Couldnt find the folder', 'require');
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
