const logger = require('../core/logger');
const {fetch, HttpError} = require('../core/utils');
const {getOrSaveSocialMediaAccount, createToken} = require('../data/accountRepository');

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

const login = async (ctx, next) => {
  const source = ctx.header['x-auth-source'];
  const acessToken = ctx.header['x-auth-token'];
  const authResponse = ctx.request.body;

  try {
    const response = await checkAccessToken(source, acessToken, authResponse);
    const account = await getOrSaveSocialMediaAccount(source, authResponse);
    const token = await createToken(source, account[0]._fields[0].properties);

    ctx.body = {token: token[0]._fields[0]};
  }
  catch(error) {
    ctx.status = 401;
    ctx.body = HttpError(401, `Unauthorized`);
  }
};

module.exports = {login};
