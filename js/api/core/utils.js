const fetch = require('node-fetch');
const logger = require('../core/logger');

const entries  = function *(obj) {
  for (let key of Object.keys(obj)) {
    yield [key, obj[key]];
  }
}

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
  entries,
  HttpError,
  fetch: _fetch
};
