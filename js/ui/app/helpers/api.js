import 'whatwg-fetch'
import {task} from 'folktale/data/task';

export default (url, method='GET', body={}, headers={}) =>
  task(async resolver => {
    try {
      const options = {
        method,
        headers: Object.assign({}, {
          'content-type': 'application/json',
          'Authorization': `Bearer ${window.localStorage.getItem('bartr_access_token')}`
        }, headers)
      };

      if(method !== 'GET') {
        options['body'] = JSON.stringify(body);
      }

      const response = await fetch(url, options);
      response.json()
        .then(resolver.resolve)
        .catch(resolver.reject);
    }
    catch(error) {
      resolver.reject(error);
    }
  });
