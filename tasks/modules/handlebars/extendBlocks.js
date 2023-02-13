module.exports = function(hbs) {
  var blocks = Object.create(null);

  hbs.registerHelper('extend', function(name, context) {
    var block = blocks[name];
    if (!block) {
      block = blocks[name] = [];
    }
    block.push(context.fn(this));
  });

  hbs.registerHelper('include', function(options) {
    var context = {},
      mergeContext = function(obj) {
        for(var k in obj)context[k]=obj[k];
      };
    mergeContext(this);
    mergeContext(options.hash);
    return options.fn(context);
  });

  hbs.registerHelper('block', function(name) {
    var val = (blocks[name] || []).join('\n');
    // clear the block
    blocks[name] = [];
    return val;
  });

  // &&
  hbs.registerHelper('and', function(value1, value2) {
    return value1 && value2;
  });

  // ||
  hbs.registerHelper('or', function(value1, value2) {
    return value1 || value2;
  });

  // !
  hbs.registerHelper('not', function(value) {
    return !value;
  });

  // ==
  hbs.registerHelper('eq', function(value1, value2) {
    return value1 == value2;
  });

  // !=
  hbs.registerHelper('ne', function(value1, value2) {
    return value1 != value2;
  });

  // <
  hbs.registerHelper('lt', function(value1, value2) {
    return value1 < value2;
  });

  // <=
  hbs.registerHelper('eqlt', function(value1, value2) {
    return value1 <= value2;
  });

  // >
  hbs.registerHelper('gt', function(value1, value2) {
    return value1 > value2;
  });

  // <=
  hbs.registerHelper('eqgt', function(value1, value2) {
    return value1 >= value2;
  });

  return hbs;
};