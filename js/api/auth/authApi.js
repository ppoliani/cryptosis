const Result = require('folktale/data/result');
const {task} = require('folktale/data/task');
const chain = require('folktale/core/fantasy-land/chain');
const logger = require('../core/logger');
const {fetch, HttpError} = require('../core/utils');
const {asyncBindSeq} = require('../core/Rop');

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

      return Result.Ok(response);
    })
};

const saveUser = authResponse => {
  return Result.Ok(authResponse);
};

const createToken = user => {
  return Result.Ok(user);
};

const login = async (ctx, next) => {
  const source = ctx.header['x-auth-source'];
  const acessToken = ctx.header['x-auth-token'];

  await new Promise((resolve, reject) => {
    asyncBindSeq(
      checkAccessToken(source, acessToken),
      saveUser,
      createToken
    )
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
