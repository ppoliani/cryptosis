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
        userId: response.id,
        email: response.emails[0].value,
        name: response.displayName,
        firstName: response.name.givenName,
        lastName: response.name.familyName,
        picture: response.image.url
      };
    default: throw new Error('Unknow oauth source');
  }
};

const hasErrors = response => response.error_description || (response.error && response.error.message);
const getErrorMessage = response => response.error_description || response.error.message;

module.exports = {
  checkAccessToken
};
