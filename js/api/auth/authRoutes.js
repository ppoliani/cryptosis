const passport = require('koa-passport');
const {getOrSaveSocialMediaAccount, createToken} = require('../data/accountRepository');
const {unwrapCypherResult} = require('../data');
const {checkAccessToken} = require('./authService');
const {partial} = require('../core/fn');
const api = require('./authApi');


const routes = {
  '/login': {
    method: 'post',
    fn: partial(api.login, checkAccessToken, getOrSaveSocialMediaAccount, createToken, unwrapCypherResult)
  },

  '/test': {
    method: 'get',
    auth: true,
    fn: (ctx, next) => {
      ctx.status = 200;
      ctx.body = ctx.state.user;
    },

  }
};

module.exports = routes;
