const {fetch} = require('../core/api');

const checkAccessToken = async (source, acessToken) => {
  const url = source === 'fb'
    ? `${process.env.FB_LOGIN_URL}=${acessToken}`
    : `${process.env.GOOGLE_LOGIN_URL}=${acessToken}`;

  const response = await fetch(url);

  if(hasErrors(response)) {
    throw new Error(`Error from social media oauth server: ${getErrorMessage(response)}`);
  }

  return normalize(source, response);
};

const normalize = (source, response) => {
  switch(source) {
    case 'fb':
      return {
        userId: response.id,
        email: response.email,
        name: response.name,
        firstName: response.first_name,
        lastName: response.last_name,
        picture: response.picture.data.url
      };
    case 'google':
      return {
        userId: response.googleId,
        email: response.email,
        name: response.name,
        firstName: response.first_name,
        lastName: response.last_name,
        picture: response.imageUrl
      };
    default: throw new Error('Unknow oauth source');
  }
};

const hasErrors = response => response.error_description || (response.error && response.error.message);
const getErrorMessage = response => response.error_description || response.error.message;

module.exports = {
  checkAccessToken
};
