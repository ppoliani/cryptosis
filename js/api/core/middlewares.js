const logger = require('../../common/core/logger');
const cors = require('kcors');
const bodyParser = require('koa-bodyparser');

const applyMiddlewares = app => {
  const corsOptions = {
    'Access-Control-Allow-Headers': ['content-type', 'x-auth-source', 'x-auth-token']
  };

  app
    .use(cors(corsOptions))
    .use(bodyParser())
    .use(async (ctx, next) => {
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
