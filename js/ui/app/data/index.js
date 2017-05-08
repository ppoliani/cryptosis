if (process.env.NODE_ENV !== 'development' || process.env.PLATFORM_ENV !== 'web') {
  module.exports = require('./core/store.prod');
}
else {
  module.exports = require('./core/store.dev');
}
