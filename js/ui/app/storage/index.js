if(process.env.PLATFORM_ENV === 'web') {
  module.exports = require('./storage.web');
}
else {
  module.exports = require('./storage.native');
}
