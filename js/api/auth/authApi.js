const login = async (ctx, next) => {
  ctx.status = 200;
  ctx.message = '/login';
  return next();
};

module.exports = { login };
