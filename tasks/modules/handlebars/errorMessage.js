const PluginError = require('plugin-error');
const log = require('fancy-log');

const errorMessage = (message, file, name = 'handlebars') => {
  const filePath = file ? { fileName: file.path } : null;
  return log(new PluginError(name, message, filePath).toString());
};

module.exports = errorMessage;