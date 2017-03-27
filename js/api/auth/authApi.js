const Result = require('folktale/data/result');
const {task} = require('folktale/data/task');
const {of: futureOf} = require('folktale/data/future')
const chain = require('folktale/core/fantasy-land/chain');
const logger = require('../core/logger');
const {fetch, HttpError} = require('../core/utils');

const checkAccessToken = (source, acessToken) => {
  const url = source === 'fb'
    ? `${process.env.FB_LOGIN_URL}=${acessToken}`
    : '';

  return fetch(url)
    .run()
    .future()
    .map(response => {
      if(response.error && response.error.message) {
        return Result.Error(response.error.message);
      }

      return response;
    })
};

const saveUser = authResponse => {
  return futureOf(authResponse);
};

const createToken = user => {
  return futureOf(Result.Ok(user));
};

const login = async (ctx, next) => {
  const source = ctx.header['x-auth-source'];
  const acessToken = ctx.header['x-auth-token'];

  await new Promise((resolve, reject) => {
    checkAccessToken(source, acessToken)
    .chain(saveUser)
    .chain(createToken)
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
    });
  });
};

module.exports = { login };
