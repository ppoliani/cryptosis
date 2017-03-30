const fetch = require('node-fetch');
const logger = require('../core/logger');

const _fetch = async (url, method='GET', headers) => {
  try {
    const options = {
      method,
      headers
    };

    const response = await fetch(url, options);
    return response.json();
  }
  catch(error) {
    resolver.reject(error);
  }
}

const HttpError = (status, message) => ({status, message});

module.exports = {
  HttpError,
  fetch: _fetch
};
