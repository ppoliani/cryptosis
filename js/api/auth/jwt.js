const jwt = require('jsonwebtoken');

const generateToken = account => {
  const tokenValue = {
    userId: account.userId,
    name: account.name
  };

  return jwt.sign(tokenValue, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFE_SPAN });
};

module.exports = {generateToken};
