const Result = require('folktale/data/result');
const logger = require('../core/logger');
const {fetch, HttpError} = require('../core/utils');

const checkAccessToken = (source, acessToken) => {
  const url = source === 'fb'
    ? `${process.env.FB_LOGIN_URL}=${acessToken}`
    : '';

  return fetch(url)
    .map(response => {
      if(response.error && response.error.message) {
        return Result.Error(response.error.message);
      }

      return Result.Ok(response);
    });
};

const login = async (ctx, next) => {
  const source = ctx.header['x-auth-source'];
  const acessToken = ctx.header['x-auth-token'];

  await new Promise((resolve, reject) => {
    checkAccessToken(source, acessToken)
    .map(result => {
      result.matchWith({
        Ok: ({value}) => {
          ctx.body = value;
          resolve(value);
        },
        Error: ({value}) => {
          reject(HttpError(401, value));
        }
      });
    })
    .run();
  });
};

module.exports = { login };
