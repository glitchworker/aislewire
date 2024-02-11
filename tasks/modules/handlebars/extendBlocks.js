export default (hbs) => {
  let blocks = Object.create(null)

  hbs.registerHelper('extend', function(name, context) {
    let block = blocks[name]
    if (!block) {
      block = blocks[name] = []
    }
    block.push(context.fn(this))
  })

  hbs.registerHelper('include', (options) => {
    let context = {}
    let mergeContext = (obj) => {
      for (let k in obj) context[k] = obj[k]
    }
    mergeContext(this)
    mergeContext(options.hash)
    return options.fn(context)
  })

  hbs.registerHelper('block', (name) => {
    let val = (blocks[name] || []).join('\n')
    // clear the block
    blocks[name] = []
    return val
  })

  hbs.registerHelper('and', (...values) => values.every(Boolean))
  hbs.registerHelper('or', (...values) => values.some(Boolean))
  hbs.registerHelper('not', (value) => !value)
  hbs.registerHelper('eq', (value1, value2) => value1 == value2)
  hbs.registerHelper('ne', (value1, value2) => value1 != value2)
  hbs.registerHelper('lt', (value1, value2) => value1 < value2)
  hbs.registerHelper('eqlt', (value1, value2) => value1 <= value2)
  hbs.registerHelper('gt', (value1, value2) => value1 > value2)
  hbs.registerHelper('eqgt', (value1, value2) => value1 >= value2)

  return hbs
}