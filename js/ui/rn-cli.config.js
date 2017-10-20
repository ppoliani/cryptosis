const path = require('path');

module.exports = {
  getProjectRoots() {
    return [
      // Keep the project directory.
      path.resolve(__dirname, './'),
      path.resolve(__dirname, './node_modules'),

      path.resolve(__dirname, '../common'),
      path.resolve(__dirname, '../common/node_modules'),
    ];
  },
};
