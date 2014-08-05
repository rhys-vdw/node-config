(function() {
  var config, exports, fs, isJsonFile, path, wrap, _;

  fs = require('fs');

  _ = require('lodash-node');

  path = require('path');

  isJsonFile = function(path) {
    var tokens;
    tokens = path.split('.');
    return tokens.length > 1 && tokens.pop() === 'json';
  };

  wrap = function(path, config) {
    return {
      path: function() {
        return path;
      },
      get: function(relativePath) {
        var newPath, result, tokens;
        newPath = path;
        tokens = relativePath.split('.');
        result = _.reduce(tokens, (function(result, token) {
          result = result[token];
          newPath = _.isEmpty(newPath) ? token : [newPath, token].join('.');
          if (result == null) {
            throw new Error("Config path '" + newPath + "' does not exist!");
          }
          return result;
        }), config);
        if (_.isPlainObject(result)) {
          return wrap(newPath, result);
        } else {
          return result;
        }
      }
    };
  };

  config = function(options) {
    var addConfig, baseConfig, dir, exists, readJson;
    options = _.extend({
      path: 'config',
      encoding: 'utf8'
    }, options);
    dir = path.resolve(process.cwd(), options.path);
    if (!fs.existsSync(dir)) {
      throw new Error("Could not find config directory '" + dir + "'!");
    }
    exists = function(fileName) {
      return fs.existsSync(path.resolve(dir, "" + fileName + ".json"));
    };
    readJson = function(fileName) {
      return JSON.parse(fs.readFileSync(path.resolve(dir, "" + fileName + ".json")));
    };
    addConfig = function(result, name) {
      var defaultConfig, localConfig;
      defaultConfig = readJson(name);
      if (exists("" + name + ".local")) {
        localConfig = readJson("" + name + ".local");
      }
      return result[name] = _.merge(defaultConfig, localConfig);
    };
    baseConfig = _(fs.readdirSync(dir)).filter(isJsonFile).map(function(filename) {
      return _.first(filename.split('.'));
    }).unique().transform(addConfig, {}).value();
    return wrap('', baseConfig);
  };

  exports = module.exports = config;

}).call(this);
