const fetch = require('node-fetch');
const logger = require('../core/logger');

const _fetch = async (url, method='GET', headers) => {
  try {
    const options = {
      method,
      headers
    };

    const response = await fetch(url, options);
    return response.json();
  }
  catch(error) {
    resolver.reject(error);
  }
}

const HTTP_NO_CONTENT = 204;
const HttpError = (status, message) => ({status, message: { error: message }});

const readFromBody = ctx => ctx.request.body;
const readUrlParam = (param, ctx) => ctx.params[param];

const createSimpleEndpoint = async (crudAction, unwrapCypherResult, options, ctx, next) => {
  const resource = options.param
    ? readUrlParam(options.param, ctx)
    : readFromBody(ctx);

  try {
    const actionResult = await crudAction({resource, ctx});

    if(options.status === HTTP_NO_CONTENT) {
      ctx.status = HTTP_NO_CONTENT;
    }
    else {
      unwrapCypherResult(actionResult)
        .matchWith({
          Just: ({value: [result]}) => {
            ctx.body = {result};
          },
          Nothing: () => {
            throw new Error();
          }
        });
    }
  }
  catch(error) {
    ctx.status = 500;
    ctx.body = HttpError(500, `${options.errorMessage}: ${ctx.state.user}`);
  }
}

module.exports = {
  HttpError,
  HTTP_NO_CONTENT,
  createSimpleEndpoint,
  fetch: _fetch
};
