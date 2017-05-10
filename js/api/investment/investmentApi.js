const {partial} = require('../core/fn');
const {createSimpleEndpoint, HTTP_NO_CONTENT} = require('../core/api');
const repository= require('../data/investmentRepository');
const {unwrapCypherResult} = require('../data');
const logger = require('../core/logger');

const createInvestment = partial(
  createSimpleEndpoint,
  repository.saveInvestment,
  unwrapCypherResult,
  {
    errorMessage: 'Error saving investment for user'
  }
)

const updateInvestment = partial(
  createSimpleEndpoint,
  repository.updateInvestment,
  unwrapCypherResult,
  {
    errorMessage: 'Error updating investment for user'
  }
)

const deleteInvestment = partial(
  createSimpleEndpoint,
  repository.deleteInvestment,
  unwrapCypherResult,
  {
    errorMessage: 'Error deleting investment for user:',
    param: 'id',
    status: HTTP_NO_CONTENT
  }
)

const createInvestmentType = partial(
  createSimpleEndpoint,
  repository.saveInvestmentType,
  unwrapCypherResult,
  {
    errorMessage: 'Error saving investment type for user:'
  }
)

const updateInvestmentType = partial(
  createSimpleEndpoint,
  repository.updateInvestmentType,
  unwrapCypherResult,
  {
    errorMessage: 'Error updating investment type for user:'
  }
)

const deleteInvestmentType = partial(
  createSimpleEndpoint,
  repository.deleteInvestmentType,
  unwrapCypherResult,
  {
    errorMessage: 'Error deleting investment type for user',
    param: 'id',
    status: HTTP_NO_CONTENT
  }
)

module.exports = {
  createInvestment,
  updateInvestment,
  deleteInvestment,
  createInvestmentType,
  updateInvestmentType,
  deleteInvestmentType
};
