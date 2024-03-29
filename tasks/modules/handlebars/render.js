import fm from 'front-matter'
import hbs from 'handlebars'
import getLayout from './getLayout.js'
import registerPartials from './registerPartials.js'
import getData from './getData.js'
import { extname, relative } from 'path'
import slash from 'slash'

const compiler = (tmpl, opts) => {
  const template = hbs.compile(tmpl, { noEscape: true })
  return template(opts)
}

const render = (file, options) => {
  registerPartials(options.partials)
  if (options.data) {
    options.globals.data = getData(options.data)
  }

  // ファイルパスを取得
  const pathReplace = slash(file.path.replace(extname(file.path), (options.ext || '.html')))
  const replaceData = pathReplace.replace(/.*?(\/pages\/)/g, '')

  // options.globals に FILE_PATH を追加
  const filePath = replaceData.replace('index.html', '')
  options.globals.FILE_PATH = filePath.replace('sp/', '')

  // options.globals に RELATIVE_PATH を追加
  const relativePath = slash(relative(replaceData, '') + '/')
  options.globals.RELATIVE_PATH = relativePath.replace('../', '')

  const attributes = fm(file.contents.toString()).attributes
  const body = compiler(fm(file.contents.toString()).body, options.globals)
  const layoutAttributes = Object.assign(options.globals, attributes, { body: body })
  const html = compiler(getLayout(file, attributes, options), layoutAttributes)

  return html
}

export default render