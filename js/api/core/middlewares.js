const logger = require('./logger');

const applyMiddlewares = app => {
  // cors middleware
  app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (ctx.request.method === 'OPTIONS') {
      ctx.status = 200;
    }
    else {
      await next();
    }
  });

  // error handling middleware
  app.use(async (ctx, next) => {
    try {
      await next();
    }
    catch (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit('error', err, ctx);
      logger.error(err.message);
    }
  });
};

module.exports = applyMiddlewares;
