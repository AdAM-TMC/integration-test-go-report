const fs = require('fs');
const path = require('path');

module.exports = (on) => {
  on('task', {
    appendToFile({ fileName, data }) {
      fs.appendFileSync(path.join(__dirname, '..', fileName), data + '\n');
      return null;
    },
  });
};
