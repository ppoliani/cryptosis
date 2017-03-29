const logger = require('../core/logger');
const {fetch, HttpError} = require('../core/utils');
const {getSocialMediaAccount, getUser} = require('../data/userRepository');

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

const createToken = account => {
  return Promise.resolve(account);
};

const login = async (ctx, next) => {
  const source = ctx.header['x-auth-source'];
  const acessToken = ctx.header['x-auth-token'];
  const authResponse = ctx.request.body;

  try {
    const response = await checkAccessToken(source, acessToken, authResponse);
    const account = await getSocialMediaAccount(source, authResponse);
    const token = await createToken(account);

    ctx.body = token;
  }
  catch(error) {
    ctx.status = 401;
    ctx.body = HttpError(401, `Unauthorized`);
  }
};

module.exports = {login};
