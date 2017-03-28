const Result = require('folktale/data/result');
const logger = require('../core/logger');
const {fetch, HttpError} = require('../core/utils');
const {asyncBindSeq} = require('../core/Rop');
const {getUser} = require('../data/userRepository');

const checkAccessToken = (source, acessToken, authResponse) => {
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

      return Result.Ok(authResponse);
    })
};

const saveUser = authResponse => {
  return getUser(authResponse);
};

const createToken = user => {
  return Result.Ok(user);
};

const login = async (ctx, next) => {
  const source = ctx.header['x-auth-source'];
  const acessToken = ctx.header['x-auth-token'];
  const authResponse = ctx.request.body;

  await new Promise((resolve, reject) => {
    asyncBindSeq(
      checkAccessToken(source, acessToken, authResponse),
      saveUser,
      createToken
    )
    .bimap(
      ({value: error}) => {
        reject(HttpError(401, error))
      },
      result => {
        result.matchWith({
          Ok: ({value}) => {
            ctx.body = value;
            resolve(value);
          },
          Error: ({value}) => {
            reject(HttpError(401, value));
          }
        });
      }
    );
  });
};

module.exports = { login };
