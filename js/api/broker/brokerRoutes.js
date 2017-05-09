const {partial} = require('../core/fn');
const {unwrapCypherResult} = require('../data');
const {saveBroker} = require('../data/brokerRepository');
const {createBroker} = require('./brokerApi');

const routes = {
  '/brokers': {
    method: 'post',
    // auth: true,
    fn: partial(createBroker, saveBroker, unwrapCypherResult)
  }
};

module.exports = routes;
