const {fetch} = require('../core/api');

const checkAccessToken = async (source, acessToken, authResponse) => {
  const url = source === 'fb'
    ? `${process.env.FB_LOGIN_URL}=${acessToken}`
    : `${process.env.GOOGLE_LOGIN_URL}=${acessToken}`;

  const response = await fetch(url);

  if(hasErrors(response)) {
    throw new Error(`Error from social media oauth server: ${getErrorMessage(response)}`);
  }

  return authResponse;
};

const hasErrors = response => response.error_description || (response.error && response.error.message);
const getErrorMessage = response => response.error_description || response.error.message;

module.exports = {
  checkAccessToken
};
