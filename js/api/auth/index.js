const passport = require('koa-passport')
const BearerStrategy = require('passport-http-bearer').Strategy;

const initAuth = () => {
  passport.use(new BearerStrategy(
    (accessToken, done) => {
      console.log(accessToken);
      done("assdfsdf");
    }
  ));
};

module.exports = {initAuth}
