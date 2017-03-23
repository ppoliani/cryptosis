const passport = require('koa-passport');
const api = require('./authApi');

const routes = {
  '/login': {
    method: 'get',
    fn: api.login
  }
};

module.exports = routes;
