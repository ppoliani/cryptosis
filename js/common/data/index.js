const {initDB} = require('./db');

const repositories = [
  require('./repositories/accountRepository'),
  require('./repositories/brokerRepository'),
  require('./repositories/investmentRepository')
];

const initRepositories = session => repositories.map(r => r.init(session));

module.exports = {
  initDB,
  initRepositories
};
