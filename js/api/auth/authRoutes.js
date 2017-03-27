const passport = require('koa-passport');
const api = require('./authApi');

const routes = {
  '/login': {
    method: 'post',
    fn: api.login
  }
};

module.exports = routes;
