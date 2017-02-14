if (process.env.NODE_ENV !== 'development' || process.env.PLATFORM_ENV !== 'web') {
  module.exports = require('./store.prod');
}
else {
  module.exports = require('./store.dev');
}
