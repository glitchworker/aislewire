import { readFileSync } from 'node:fs'
import path from 'path'
import { glob } from 'glob'

export default (url, parent, done) => {
  const base = path.join(path.dirname(parent), url)
  if (glob.hasMagic(base)) {
    glob(base, { nodir: true }, (err, files) => {
      const contents = files.map(cur => readFileSync(cur, 'utf8'))
      done({contents: contents.join('\n')})
    });
  } else {
    done({file: url})
  }
}