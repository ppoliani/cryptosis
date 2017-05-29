const passport = require('koa-passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const {identity} = require('folktale/core/lambda')
const logger = require('../../common/core/logger');
const {getTokenAndCorrespondingAccounts, deleteToken} = require('../../common/data/repositories/accountRepository');
const {unwrapCypherResult} = require('../../common/data/utils');
const {HttpError} = require('../core/api');
const {decodeToken} = require('../auth/jwt');

const initAuth = () => {
  const deleteTokenIfNeeded = async error => {
    try {
      await error.matchWith && error.matchWith({
        Expired: async ({value:token}) => await deleteToken(token),
        Decode: identity
      })
    }
    catch(err) {
      logger.error(`Could delete token that was expired: ${token}`)
    }
  }

  // 1. Check if token exists
  // 2. IF not send 401
  // 3. ELSE check expiry date
  // 4. IF expired send 401
  // 5. ELSE get user from db
  // 6. IF user doesn't exist 401
  // 7. ELSE done(null, user)
  passport.use(new BearerStrategy(
    async (accessToken, done) => {
      try {
        const result = await getTokenAndCorrespondingAccounts(accessToken);
        await unwrapCypherResult(result).matchWith({
          Just: async ({value: [_, account]}) => {
            const decodedToken = await decodeToken(accessToken);
            done(null, Object.assign({}, account, {id: decodedToken.userId})); // userId is the id of the user node
          },
          Nothing: () => { throw new Error(); }
        });
      }
      catch(error) {
        await deleteTokenIfNeeded(error);
        logger.error(`Error while verifying access token: ${error}`);
        done(HttpError(401, 'Unauthorized'));
      }
    }
  ));
};

module.exports = {initAuth}
