const through = require('through2');
const { extname } = require('path');
const { allowedExtensions } = require('./config');
const render = require('./render');
const errorMessage = require('./errorMessage');

const isHandlebars = function (file) {
  return allowedExtensions.indexOf(extname(file.path).split('.').pop()) >= 0;
};

const handlebars = (options = {}) => {
  options.globals = options.globals || {};
  return through.obj(function(file, encoding, callback) {
    if (file.isNull()) {
      return callback(null, file);
    }
    if (file.isStream()) {
      return callback(errorMessage('Streams not supported!', file));
    }
    if (!isHandlebars(file)) {
      return callback(errorMessage(`File extension not supported! Allowed extensions: ${allowedExtensions.join(', ')}.`, file));
    }
    try {
      file.contents = Buffer.from(render(file, options));
      file.path = file.path.replace(extname(file.path), (options.ext || '.html'));
    } catch (err) {
      return callback(errorMessage(err, file));
    }
    return callback(null, file);
  });
};

module.exports = handlebars;