"use strict";
/**
 * Conditionally includes Webpack plugins.
 */
var IfPlugin = /** @class */ (function () {
    /**
     * @param condition
     *        The condition to be checked.
     *
     * @param truePlugin
     *        The plugin to use when the condition is met.
     *
     * @param falsePlugin
     *        The plugin to use when the condition is not met.
     *        Defaults to a plugin that simply does nothing.
     *
     * @return `truePlugin` if the condition is met, or else `falsePlugin`.
     */
    function IfPlugin(condition, truePlugin, falsePlugin) {
        this.condition = condition;
        this.truePlugin = truePlugin;
        this.falsePlugin = falsePlugin;
    }
    IfPlugin.prototype.apply = function (compiler) {
        if (this.condition) {
            this.truePlugin.apply(compiler);
        }
        else if (this.falsePlugin) {
            this.falsePlugin.apply(compiler);
        }
    };
    return IfPlugin;
}());
module.exports = IfPlugin;
