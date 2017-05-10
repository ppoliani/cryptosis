const {
  createInvestment,
  createInvestmentType,
  updateInvestmentType,
  deleteInvestmentType
} = require('./investmentApi');

const routes = {
  '/investments': {
    method: 'post',
    // auth: true,
    fn: createInvestment
  },

  '/investment/types': {
    method: 'post',
    // auth: true,
    fn: createInvestmentType
  },

  '/investment/types$': {
    method: 'put',
    // auth: true,
    fn: updateInvestmentType
  },

  '/investment/types/:id': {
    method: 'delete',
    // auth: true,
    fn: deleteInvestmentType
  }
};

module.exports = routes;
