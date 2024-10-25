const { defineConfig } = require("cypress");
const fs = require('fs');
const path = require('path');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      on('task', {
        appendToFile({ fileName, data }) {
          fs.appendFileSync(path.join(__dirname, fileName), data + '\n');
          return null;
        },
      });
    },
  },
});