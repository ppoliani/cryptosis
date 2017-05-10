const {
  createInvestment,
  updateInvestment,
  deleteInvestment,
  createInvestmentType,
  updateInvestmentType,
  deleteInvestmentType
} = require('./investmentApi');

const routes = {
  '/investments': {
    method: 'post',
    auth: true,
    fn: createInvestment
  },

  '/investments$': {
    method: 'put',
    auth: true,
    fn: updateInvestment
  },

  '/investments/:id': {
    method: 'delete',
    auth: true,
    fn: deleteInvestment
  },

  '/investment/types': {
    method: 'post',
    auth: true,
    fn: createInvestmentType
  },

  '/investment/types$': {
    method: 'put',
    auth: true,
    fn: updateInvestmentType
  },

  '/investment/types/:id': {
    method: 'delete',
    auth: true,
    fn: deleteInvestmentType
  }
};

module.exports = routes;
