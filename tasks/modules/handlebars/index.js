import through from 'through2'
import { extname } from 'path'
import { allowedExtensions } from './config.js'
import render from './render.js'
import errorMessage from './errorMessage.js'

const isHandlebars = (file) => {
  return allowedExtensions.indexOf(extname(file.path).split('.').pop()) >= 0
}

const handlebars = (options = {}) => {
  options.globals = options.globals || {}
  return through.obj((file, encoding, callback) => {
    if (file.isNull()) {
      return callback(null, file)
    }
    if (file.isStream()) {
      return callback(errorMessage('Streams not supported!', file))
    }
    if (!isHandlebars(file)) {
      return callback(errorMessage(`File extension not supported! Allowed extensions: ${allowedExtensions.join(', ')}.`, file))
    }
    try {
      file.contents = Buffer.from(render(file, options))
      file.path = file.path.replace(extname(file.path), (options.ext || '.html'))
    } catch (err) {
      return callback(errorMessage(err, file))
    }
    return callback(null, file)
  })
}

export default handlebars