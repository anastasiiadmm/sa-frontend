const path = require('path');

module.exports = {
  process(src: string, filename: string, config: string, options: string) {
    return `module.exports = ${JSON.stringify(path.basename(filename))};`;
  },
};
