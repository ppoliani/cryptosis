const fetch = require('node-fetch');
const logger = require('../core/logger');
const { task } = require('folktale/data/task');

const entries  = function *(obj) {
  for (let key of Object.keys(obj)) {
    yield [key, obj[key]];
  }
}

const _fetch = (url, method='GET', headers) =>
  task(async resolver => {
    try {
      const options = {
        method,
        headers
      };

      const response = await fetch(url, options);

      response.json()
        .then(response => {
          logger.log(response);
          resolver.resolve(response);
        })
        .catch(error => {
          logger.error(error);
          resolver.reject(error);
        });
    }
    catch(error) {
      resolver.reject(error);
    }
  });

const HttpError = (status, message) => ({status, message});

module.exports = {
  entries,
  HttpError,
  fetch: _fetch
};
