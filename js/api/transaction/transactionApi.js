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
  unwrapCypherResult,
  {
    errorMessage: 'Error getting transactions for user'
  }
)

module.exports = {
  createTransaction,
  updateTransaction,
  getTransactions
}
