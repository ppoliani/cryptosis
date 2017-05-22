const passport = require('koa-passport');
const {entries} = require('./utils');

const routes = [
  require('../auth/authRoutes'),
  require('../broker/brokerRoutes'),
  require('../investment/investmentRoutes')
];

const setup = router => {
  routes.forEach(route => {
    for(let [endpoint, {method, auth, middlewares = [], fn}] of entries(route)) {
      middlewares = auth
        ? [passport.authenticate('bearer', {session: false}), ...middlewares]
        : middlewares;

      router[method](endpoint.replace(/[$]*/g,''), fn, ...middlewares);
    }
  });

  return router;
};

module.exports = setup;
