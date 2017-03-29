const passport = require('koa-passport');
const api = require('./authApi');

const routes = {
  '/login': {
    method: 'post',
    fn: api.login
  },

  '/test': {
    method: 'get',
    auth: true,
    fn: (ctx, next) => {
      console.log();
      next();
    },

  }
};

module.exports = routes;
