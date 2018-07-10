const path = require('path');
const fs = require('fs');
let entries = {};

const getEntries = (baseDir) => {
  const files = fs.readdirSync(baseDir);
  files.forEach(file => {
    if (file == 'kakashi.mock.js') {
      return;
    }
    const absFile = path.join(baseDir, file);
    if (fs.statSync(absFile).isDirectory()) {
      getEntries(absFile);
    } else if (path.posix.basename(absFile) !== 'index.js') {
      const extname = path.extname(absFile);
      if (extname == '.js') {
        let mod = require(absFile);
        Object.assign(entries, mod);
      }
    }
  });
};

getEntries(__dirname);

module.exports = entries;