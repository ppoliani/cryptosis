const {partial} = require('../../common/core/fn');
const {createSimpleEndpoint, HTTP_NO_CONTENT} = require('../core/api');
const repository = require('../../common/data/repositories/transactionRepository');
const {unwrapCypherResult, unwrapCypherResultToMap} = require('../../common/data/utils');
const logger = require('../../common/core/logger');

const createTransaction = partial(
  createSimpleEndpoint,
  repository.createTransaction,
  unwrapCypherResult,
  {
    errorMessage: 'Error saving transaction for user'
  }
)

const updateTransaction = partial(
  createSimpleEndpoint,
  repository.updateTransaction,
  unwrapCypherResult,
  {
    errorMessage: 'Error updating transaction for user'
  }
)

const getTransactions = partial(
  createSimpleEndpoint,
  repository.getTransactions,
  unwrapCypherResultToMap,
  {
    errorMessage: 'Error fetching transactions for user'
  }
)

const getPartialTransactions = partial(
  createSimpleEndpoint,
  repository.getPartialTransactions,
  unwrapCypherResultToMap,
  {
    errorMessage: 'Error fetching partial transactions for user'
  }
)

const getTransaction = partial(
  createSimpleEndpoint,
  repository.getTransaction,
  unwrapCypherResult,
  {
    errorMessage: 'Error fetching asset for user',
    param: 'id'
  }
)

const deleteTransaction = partial(
  createSimpleEndpoint,
  repository.deleteTransaction,
  unwrapCypherResult,
  {
    errorMessage: 'Error deleting transaction for user:',
    param: 'id',
    status: HTTP_NO_CONTENT
  }
)

const getTransactionsCount = partial(
  createSimpleEndpoint,
  repository.getTransactionsCount,
  unwrapCypherResult,
  {
    errorMessage: 'Error fetching transactions count for user'
  }
)

module.exports = {
  createTransaction,
  updateTransaction,
  getTransactions,
  getTransaction,
  getPartialTransactions,
  deleteTransaction,
  getTransactionsCount
}
