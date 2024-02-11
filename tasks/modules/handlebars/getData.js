import { readFileSync } from 'node:fs'
import directoryTree from 'directory-tree'
import yaml from 'js-yaml'
import { basename, resolve, extname } from 'path'
import { allowedDataExtensions } from './config.js'
import errorMessage from './errorMessage.js'

const createDataObj = (files, obj = {}) => {
  files.forEach(async (file) => {
    if(file.children) {
      obj[file.name] = createDataObj(file.children);
    } else if(file.name.split('.').pop() === 'json') {
      try {
        obj[basename(file.name, extname(file.name))] = JSON.parse(readFileSync(file.path))
      } catch (err) {
        return errorMessage(err, file)
      }
    } else if (file.name.split('.').pop() === 'yml') {
      obj[basename(file.name, extname(file.name))] = yaml.load(readFileSync(file.path))
    }
  })
  return obj
}

const getData = (path, obj = {}) => {
  const files = directoryTree(path, {
    normalizePath: true,
    extensions: new RegExp(`.(${allowedDataExtensions.join('|')})`)
  })
  return Object.assign(obj, createDataObj(files.children))
}

export default getData