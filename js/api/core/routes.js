const passport = require('koa-passport')
const { entries } = require('./utils');

const routes = [
  require('../auth/authRoutes')
];

const setup = router => {
  routes.forEach(route => {
    for(let [endpoint, { method, auth, middlewares = [], fn }] of entries(route)) {
      middlewares = auth
        ? [passport.authenticate('bearer', { session: false }), ...middlewares]
        : middlewares;

      router[method](endpoint, ...middlewares, fn)
    }
  });

  return router;
};

module.exports = setup;
