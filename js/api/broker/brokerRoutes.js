const {createBroker, updateBroker, deleteBroker} = require('./brokerApi');

const routes = {
  '/brokers': {
    method: 'post',
    // auth: true,
    fn: createBroker
  },

  '/brokers$': {
    method: 'put',
    // auth: true,
    fn: updateBroker
  },

  '/brokers/:brokerId': {
    method: 'delete',
    // auth: true,
    fn: deleteBroker
  }
};

module.exports = routes;
