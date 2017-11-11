const {
  createTransaction,
  updateTransaction,
  getTransactions,
  getTransaction,
  getPartialTransactions,
  deleteTransaction,
  getTransactionsCount
} = require('./transactionApi');

const routes = {
  '/transactions': {
    method: 'get',
    auth: true,
    fn: getTransactions
  },

  '/transactions/count': {
    method: 'get',
    auth: true,
    fn: getTransactionsCount
  },

  '/transactions/partial': {
    method: 'get',
    auth: true,
    fn: getPartialTransactions
  },


  '/transactions$': {
    method: 'post',
    auth: true,
    fn: createTransaction
  },

  '/transactions/:id': {
    method: 'get',
    auth: true,
    fn: getTransaction
  },

  '/transactions/:id$': {
    method: 'put',
    auth: true,
    fn: updateTransaction
  },

  '/transactions/:id$$': {
    method: 'delete',
    auth: true,
    fn: deleteTransaction
  }
};

module.exports = routes;
