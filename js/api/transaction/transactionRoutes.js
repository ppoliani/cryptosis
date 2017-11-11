const {
  createTransaction
} = require('./transactionApi');

const routes = {
  '/transactions$': {
    method: 'post',
    // auth: true,
    fn: createTransaction
  },
};

module.exports = routes;
