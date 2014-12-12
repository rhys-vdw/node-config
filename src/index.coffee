fs = require 'fs'
_ = require 'lodash-node'
path = require 'path'

isJsonFile = (path) ->
  tokens = path.split '.'
  return tokens.length > 1 && tokens.pop() == 'json'

wrap = (path, config) ->
  return {
    path: -> path
    getRaw: (relativePath) -> @get relativePath, true
    get: (relativePath, raw) ->
      newPath = path
      tokens = relativePath.split '.'

      result = _.reduce tokens, ((result, token) ->
        result = result[token]
        newPath = if _.isEmpty newPath then token else [newPath, token].join '.'
        throw new Error "Config path '#{ newPath }' does not exist!" if not result?
        return result
      ), config

      return if (_.isPlainObject(result) && !raw) then wrap newPath, result else _.cloneDeep result
  }


config =
  get:    -> throw new Error 'Config has not been initialized!'
  getRaw: -> throw new Error 'Config has not been initialized!'
  path:   -> throw new Error 'Config has not been initialized!'
  initialize: (options) ->
    if _.isString options
      options = path: options

    options = _.extend { path: 'config', encoding: 'utf8' }, options

    # Get path to config directory.
    dir = path.resolve process.cwd(), options.path
    if ! fs.existsSync dir
      throw new Error "Could not find config directory '#{ dir }'!"

    exists = (fileName) ->
      fs.existsSync path.resolve(dir, "#{ fileName }.json")

    readJson = (fileName) ->
      JSON.parse fs.readFileSync path.resolve(dir, "#{ fileName }.json")

    addConfig = (result, name) ->
      defaultConfig = readJson name

      if exists "#{ name }.local"
        localConfig = readJson "#{ name }.local"

      result[name] = _.merge defaultConfig, localConfig

    # Get a list of files names unique before the first period.
    baseConfig = _(fs.readdirSync dir)
      .filter isJsonFile
      .map (filename) -> _.first filename.split('.')
      .unique()
      .transform addConfig, {}
      .value()

    # Override get and path members.
    _.extend @, wrap '', baseConfig
    @.initialize = -> throw new Error 'Already initialized!'

exports = module.exports = config
