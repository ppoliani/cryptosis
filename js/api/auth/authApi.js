const identity = require('folktale/core/lambda/identity');
const logger = require('../core/logger');
const {HttpError} = require('../core/api');

const login = async (checkAccessToken, getOrSaveSocialMediaAccount, createToken, unwrapCypherResult, ctx, next) => {
  const source = ctx.header['x-auth-source'];
  const acessToken = ctx.header['x-auth-token'];

  try {
    const response = await checkAccessToken(source, acessToken);
    const account = await getOrSaveSocialMediaAccount(source, response);

    // unwrapCypherResult doesn't do any async but it's Just case does
    // so we need to await here, as well
    await unwrapCypherResult(account)
      .matchWith({
        Just: async ({value: [account]}) => {
          const token = await createToken(source, account);

          unwrapCypherResult(token)
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
