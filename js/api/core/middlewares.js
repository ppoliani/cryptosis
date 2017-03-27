const logger = require('./logger');
const cors = require('kcors');

const applyMiddlewares = app => {
  const corsOptions = {
    'Access-Control-Allow-Headers': ['content-type', 'x-auth-source', 'x-auth-token']
  };

  app.use(cors(corsOptions));

  // error handling middleware
  app.use(async (ctx, next) => {
    try {
      await next();
    }
    catch (err) {
      logger.error(err.message);
      ctx.status = err.status || 500;
      ctx.body = err.message;
    }
  });
};

module.exports = applyMiddlewares;
