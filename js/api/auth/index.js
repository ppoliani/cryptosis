const passport = require('koa-passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const logger = require('../core/logger');
const {getTokenAndCorrespondingAccounts} = require('../data/accountRepository');
const {unwrapCypherResult} = require('../data');
const {HttpError} = require('../core/api');
const {decodeToken} = require('../auth/jwt');

const initAuth = () => {
  // 1. Check if token exists
  // 2. IF not send 401
  // 3. ELSE check expiry date
  // 4. IF expired send 401 and remove token from the db
  // 5. ELSE get user from db
  // 6. IF user doesn't exist 401
  // 7. ELSE done(null, user)
  passport.use(new BearerStrategy(
    async (accessToken, done) => {
      try {
        const result = await getTokenAndCorrespondingAccounts(accessToken);
        unwrapCypherResult(result).matchWith({
          Just: async ({value: [_, account]}) => {
            const decodedToken = await decodeToken(accessToken);
            done(null, account);
          },
          Nothing: () => { throw new Error(); }
        });
      }
      catch(error) {
        logger.error(`Error while verifying access token: ${error}`);
        done(HttpError(401, 'Unauthorized'));
      }
    }
  ));
};

module.exports = {initAuth}
