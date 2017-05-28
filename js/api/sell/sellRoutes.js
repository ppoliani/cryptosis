const {
  getSells,
  getSell,
  createSell,
  updateSell,
  deleteSell
} = require('./sellApi');

const routes = {
  '/sells': {
    method: 'get',
    auth: true,
    fn: getSells
  },

  '/sells/:id': {
    method: 'get',
    auth: true,
    fn: getSell
  },

  '/sells$': {
    method: 'post',
    // auth: true,
    fn: createSell
  },

  '/sells/:id$': {
    method: 'put',
    auth: true,
    fn: updateSell
  },

  '/sells/:id$$': {
    method: 'delete',
    auth: true,
    fn: deleteSell
  }
}

module.exports = routes;
