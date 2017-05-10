const {initDB} = require('./db');

const repositories = [
  require('./accountRepository'),
  require('./brokerRepository'),
  require('./investmentRepository')
];

const initRepositories = session => repositories.map(r => r.init(session));

module.exports = {
  initDB,
  initRepositories
};
