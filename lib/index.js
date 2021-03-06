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
      getRaw: function(relativePath) {
        return this.get(relativePath, true);
      },
      get: function(relativePath, raw) {
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
        if (_.isPlainObject(result) && !raw) {
          return wrap(newPath, result);
        } else {
          return result;
        }
      }
    };
  };

  config = {
    get: function() {
      throw new Error('Config has not been initialized!');
    },
    getRaw: function() {
      throw new Error('Config has not been initialized!');
    },
    path: function() {
      throw new Error('Config has not been initialized!');
    },
    initialize: function(options) {
      var addConfig, baseConfig, dir, exists, readJson;
      if (_.isString(options)) {
        options = {
          path: options
        };
      }
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
      _.extend(this, wrap('', baseConfig));
      return this.initialize = function() {
        throw new Error('Already initialized!');
      };
    }
  };

  exports = module.exports = config;

}).call(this);
