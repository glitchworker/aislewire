import { readFileSync } from 'node:fs'
import { join, extname } from 'path'
import errorMessage from './errorMessage.js'

const getLayout = (file, attributes, options) => {
  attributes.layout = attributes.layout || 'default'
  const layout = join(options.layouts, attributes.layout) + extname(file.path)
  try {
    return readFileSync(layout, 'utf8')
  } catch (err) {
    return errorMessage(`Layout: ${attributes.layout} dont't exists.`, file)
  }
}

export default getLayout