const {
  createTransaction,
  updateTransaction
} = require('./transactionApi');

const routes = {
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
