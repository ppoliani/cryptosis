const identity = require('folktale/core/lambda/identity');
const logger = require('../core/logger');
const {fetch, HttpError} = require('../core/api');
const {unwrapCypherResult} = require('../data');
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

    await unwrapCypherResult(account)
      .matchWith({
        Just: async ({value: [account]}) => {
          const token = await createToken(source, account);
          await unwrapCypherResult(token)
            .matchWith({
              Just: ({value: [token]}) => {
                ctx.body = {token};
              },
              Nothing: () => {
                throw new Error();
              }
           })
        },
        Nothing: identity
      });
  }
  catch(error) {
    ctx.body = HttpError(403, 'Access Denied');
  }
};

module.exports = {login};
