const {
  createTransaction,
  updateTransaction,
  getTransactions
} = require('./transactionApi');

const routes = {
  '/transactions': {
    method: 'get',
    // auth: true,
    fn: getTransactions
  },

  '/transactions$': {
    method: 'post',
    // auth: true,
    fn: createTransaction
  },

  '/transactions/:id$': {
    method: 'put',
    // auth: true,
    fn: updateTransaction
  },
};

module.exports = routes;
