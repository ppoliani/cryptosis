const Result = require('folktale/data/result');
const logger = require('../core/logger');
const {fetch, HttpError} = require('../core/utils');
const {getUser} = require('../data/userRepository');

const checkAccessToken = async (source, acessToken, authResponse) => {
  const url = source === 'fb'
    ? `${process.env.FB_LOGIN_URL}=${acessToken}`
    : '';

  const response = await fetch(url);

  if(response.error && response.error.message) {
    throw new Error(`Error from social media oauth server: ${response.error.message}`);
  }

  return authResponse;
};

const saveUser = authResponse => {
  return getUser(authResponse);
};

const createToken = user => {
  return Promise.resolve(user);
};

const login = async (ctx, next) => {
  const source = ctx.header['x-auth-source'];
  const acessToken = ctx.header['x-auth-token'];
  const authResponse = ctx.request.body;

  try {
    const response = await checkAccessToken(source, acessToken, authResponse);
    const user = await saveUser(response);
    const token = await createToken(user);

    ctx.body = token;
  }
  catch(error) {
    ctx.status = 401;
    ctx.body = HttpError(401, `Unauthorized`);
  }
};

module.exports = {login};
