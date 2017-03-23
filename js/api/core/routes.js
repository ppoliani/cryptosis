const { entries } = require('./utils');
const routes = [
  require('../auth/authRoutes')
];

const setup = router => {
  routes.forEach(route => {
    for(let [endpoint, { method, middleware = [], fn }] of entries(route)) {
      router[method](endpoint, ...middleware, fn)
    }
  });

  return router;
};

module.exports = setup;
