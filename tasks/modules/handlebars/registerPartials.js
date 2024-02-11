import { readFileSync } from 'node:fs'
import slash from 'slash'
import { glob, globSync, globStream, globStreamSync, Glob } from 'glob'
import { join, extname } from 'path'
import hbs from 'handlebars'
import extend from './extendBlocks.js'
import { allowedExtensions } from './config.js'
import errorMessage from './errorMessage.js'

const hbsExtend = extend(hbs)

const createPartial = (paths, path = '') => {
  const files = globSync(`${paths}/**/*.{${allowedExtensions.join()}}`)
  files.forEach((file) => {
    const basePath = slash(file).split(`${paths}/`)[1]
    const partialName = slash(join(path,`${basePath.split(extname(basePath))[0]}`))
    const content = readFileSync(file, 'utf8')
    hbsExtend.registerPartial(partialName, content)
  })
}

const registerPartials = (paths) => {
  if (typeof paths === 'object') {
    return Object.entries(paths).forEach(([alias, path]) => createPartial(path, alias))
  } else if (typeof paths === 'string') {
    return createPartial(paths)
  }
}

export default registerPartials