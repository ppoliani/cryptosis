const {
  getPartialInvestments,
  getInvestments,
  getInvestment,
  createInvestment,
  updateInvestment,
  deleteInvestment,
  getInvestmentTypes,
  createInvestmentType,
  updateInvestmentType,
  deleteInvestmentType
} = require('./investmentApi');

const routes = {
  '/investments/partial': {
    method: 'get',
    auth: true,
    fn: getPartialInvestments
  },

  '/investments': {
    method: 'get',
    auth: true,
    fn: getInvestments
  },

  '/investments/:id': {
    method: 'get',
    auth: true,
    fn: getInvestment
  },

  '/investments$': {
    method: 'post',
    auth: true,
    fn: createInvestment
  },

  '/investments/:id$': {
    method: 'put',
    auth: true,
    fn: updateInvestment
  },

  '/investments/:id$$': {
    method: 'delete',
    auth: true,
    fn: deleteInvestment
  },

  '/investment/types': {
    method: 'get',
    auth: true,
    fn: getInvestmentTypes
  },

  '/investment/types$': {
    method: 'post',
    auth: true,
    fn: createInvestmentType
  },

  '/investment/types/:id': {
    method: 'put',
    auth: true,
    fn: updateInvestmentType
  },

  '/investment/types/:id$': {
    method: 'delete',
    auth: true,
    fn: deleteInvestmentType
  }
};

module.exports = routes;
