const {partial} = require('../core/fn');
const {unwrapCypherResult} = require('../data');
const {saveInvestment, saveInvestmentType} = require('../data/investmentRepository');
const {createInvestment, createInvestmentType} = require('./investmentApi');

const routes = {
  '/investments': {
    method: 'post',
    // auth: true,
    fn: partial(createInvestment, saveInvestment, unwrapCypherResult)
  },

  '/investment/types': {
    method: 'post',
    // auth: true,
    fn: partial(createInvestmentType, saveInvestmentType, unwrapCypherResult)
  }
};

module.exports = routes;
