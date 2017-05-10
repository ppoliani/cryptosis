const {partial} = require('../core/fn');
const {createSimpleEnpoint, HTTP_NO_CONTENT} = require('../core/api');
const repository= require('../data/investmentRepository');
const {unwrapCypherResult} = require('../data');
const logger = require('../core/logger');

const createInvestment = partial(
  createSimpleEnpoint,
  repository.saveInvestment,
  unwrapCypherResult,
  {
    errorMessage: 'Error saving investment for user'
  }
)

const updateInvestment = partial(
  createSimpleEnpoint,
  repository.updateInvestment,
  unwrapCypherResult,
  {
    errorMessage: 'Error updating investment for user'
  }
)

const deleteInvestment = partial(
  createSimpleEnpoint,
  repository.deleteInvestment,
  unwrapCypherResult,
  {
    errorMessage: 'Error deleting investment for user:',
    param: 'id',
    status: HTTP_NO_CONTENT
  }
)

const createInvestmentType = partial(
  createSimpleEnpoint,
  repository.saveInvestmentType,
  unwrapCypherResult,
  {
    errorMessage: 'Error saving investment type for user:'
  }
)

const updateInvestmentType = partial(
  createSimpleEnpoint,
  repository.updateInvestmentType,
  unwrapCypherResult,
  {
    errorMessage: 'Error updating investment type for user:'
  }
)

const deleteInvestmentType = partial(
  createSimpleEnpoint,
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
