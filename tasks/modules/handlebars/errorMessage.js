import PluginError from 'plugin-error'
import log from 'fancy-log'

const errorMessage = (message, file, name = 'handlebars') => {
  const filePath = file ? { fileName: file.path } : null
  return log(new PluginError(name, message, filePath).toString())
}

export default errorMessage