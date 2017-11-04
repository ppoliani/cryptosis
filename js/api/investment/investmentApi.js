const {partial} = require('../../common/core/fn');
const {createSimpleEndpoint, HTTP_NO_CONTENT} = require('../core/api');
const repository = require('../../common/data/repositories/investmentRepository');
const {unwrapCypherResult, unwrapCypherResultToMap} = require('../../common/data/utils');
const logger = require('../../common/core/logger');

const getPartialInvestments = partial(
  createSimpleEndpoint,
  repository.getPartialInvestments,
  unwrapCypherResultToMap,
  {
    errorMessage: 'Error fetching partial investments for user'
  }
)

const getInvestmentsCount = partial(
  createSimpleEndpoint,
  repository.getInvestmentsCount,
  unwrapCypherResult,
  {
    errorMessage: 'Error fetching investments count for user'
  }
)

const getInvestments = partial(
  createSimpleEndpoint,
  repository.getInvestments,
  unwrapCypherResultToMap,
  {
    errorMessage: 'Error fetching investments for user'
  }
)

const getInvestment = partial(
  createSimpleEndpoint,
  repository.getInvestment,
  unwrapCypherResult,
  {
    errorMessage: 'Error fetching investment for user',
    param: 'id'
  }
)

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

const getInvestmentTypes = partial(
  createSimpleEndpoint,
  repository.getInvestmentTypes,
  unwrapCypherResultToMap,
  {
    errorMessage: 'Error fetching investment types for user'
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
  getPartialInvestments,
  getInvestmentsCount,
  getInvestments,
  getInvestment,
  createInvestment,
  updateInvestment,
  deleteInvestment,
  getInvestmentTypes,
  createInvestmentType,
  updateInvestmentType,
  deleteInvestmentType
};
