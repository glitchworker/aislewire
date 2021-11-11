const fs = require('fs');
const path = require('path');
const glob = require('glob');

module.exports = function(url, parent, done) {
  const base = path.join(path.dirname(parent), url);
  if (glob.hasMagic(base)) {
    glob(base, { nodir: true }, function(err, files) {
      const contents = files.map(cur => fs.readFileSync(cur, 'utf8'));
      done({contents: contents.join('\n')});
    });
  } else {
    done({file: url});
  }
}