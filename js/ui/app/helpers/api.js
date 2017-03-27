import 'whatwg-fetch'
import { task } from 'folktale/data/task';

export default (url, method='GET', headers={}) =>
  task(async resolver => {
    try {
      const options = {
        method,
        headers: Object.assign({}, {
          'Content-type': 'application/json; charset=UTF-8'
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
