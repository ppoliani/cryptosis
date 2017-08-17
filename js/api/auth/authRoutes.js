const {getOrSaveSocialMediaAccount, createToken} = require('../../common/data/repositories/accountRepository');
const {unwrapCypherResult} = require('../../common/data/utils');
const {checkAccessToken} = require('./authService');
const {partial} = require('../../common/core/fn');
const {login} = require('./authApi');

const routes = {
  '/login': {
    method: 'post',
    fn: partial(login, checkAccessToken, getOrSaveSocialMediaAccount, createToken, unwrapCypherResult)
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
