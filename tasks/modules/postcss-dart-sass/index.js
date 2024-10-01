import postcss from 'postcss'
import * as defaultNodeSass from 'sass'

export default opt => ({
  postcssPlugin: 'postcss-dart-sass',
  async Once (root, { result }) {
    let sass = opt.sass || defaultNodeSass;
    let map = typeof result.opts.map === 'object' ? result.opts.map : {}
    let css = root.toResult(Object.assign(result.opts, {
      map: Object.assign({
        annotation: false,
        inline: false,
        sourcesContent: true
      }, map)
    }))

    opt = Object.assign({
      indentWidth: 2,
      omitSourceMapUrl: true,
      outputStyle: 'expanded',
      sourceMap: true,
      sourceMapContents: true
    }, opt, {
      data: css.css,
      file: result.opts.from,
      silenceDeprecations: ['legacy-js-api'],
      outFile: result.opts.to
    })

    const renderSass = await new Promise((resolve, reject) => sass.render(
      opt,
      (err, res) => err ? reject(err) : resolve(res)
    ));

    let includedFiles = renderSass.stats.includedFiles.filter((item, pos, array) => array.indexOf(item) === pos);

    const parseSass = postcss.parse(renderSass.css.toString(), {
      from: result.opts.from,
      map: {
        prev: renderSass.map ? JSON.parse(renderSass.map.toString()) : ''
      }
    });

    result.root = parseSass;
    result.messages = includedFiles.map(file => ({ type: 'dependency', parent: result.opts.from, file }));
  }
})

export { postcss }