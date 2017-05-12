const {
  getBrokers,
  createBroker,
  updateBroker,
  deleteBroker
} = require('./brokerApi');

const routes = {
  '/brokers': {
    method: 'get',
    auth: true,
    fn: getBrokers
  },

  '/brokers$': {
    method: 'post',
    auth: true,
    fn: createBroker
  },

  '/brokers/:id$': {
    method: 'put',
    auth: true,
    fn: updateBroker
  },

  '/brokers/:id': {
    method: 'delete',
    auth: true,
    fn: deleteBroker
  }
};

module.exports = routes;
