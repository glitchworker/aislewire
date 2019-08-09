const fs = require('fs');
const slash = require('slash');
const glob = require('glob');
const { join, extname } = require('path');
const hbs = require('handlebars');
const extend = require('./extendBlocks');
const { allowedExtensions } = require('./config');
const errorMessage = require('./errorMessage');

const hbsExtend = extend(hbs);

const createPartial = (paths, path = '') => {
  const files = glob.sync(`${paths}/**/*.{${allowedExtensions.join()}}`);
  files.forEach((file) => {
    const basePath = file.split(`${paths}/`)[1];
    const partialName = slash(join(path,`${basePath.split(extname(basePath))[0]}`));
    const content = fs.readFileSync(file, 'utf8');
    hbsExtend.registerPartial(partialName, content);
  });
};

const registerPartials = (paths) => {
  if (typeof paths === 'object') {
    return Object.entries(paths).forEach(([alias, path]) => createPartial(path, alias));
  } else if (typeof paths === 'string') {
    return createPartial(paths);
  }
};

module.exports = registerPartials;