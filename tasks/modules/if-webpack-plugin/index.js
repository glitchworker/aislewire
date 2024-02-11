class IfPlugin {
  constructor(condition, truePlugin, falsePlugin) {
    this.condition = condition
    this.truePlugin = truePlugin
    this.falsePlugin = falsePlugin
  }

  apply = (compiler) => {
    if (this.condition) {
      this.truePlugin.apply(compiler)
    } else if (this.falsePlugin) {
      this.falsePlugin.apply(compiler)
    }
  }
}

export default IfPlugin