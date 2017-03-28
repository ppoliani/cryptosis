import 'whatwg-fetch'
import { task } from 'folktale/data/task';

export default (url, method='GET', body={}, headers={}) =>
  task(async resolver => {
    try {
      const options = {
        method,
        body: JSON.stringify(body),
        headers: Object.assign({}, {
          'content-type': 'application/json'
        }, headers)
      };

      const response = await fetch(url, options);
      response.json()
        .then(resolver.resolve)
        .catch(resolver.reject);
    }
    catch(error) {
      resolver.reject(error);
    }
  });
