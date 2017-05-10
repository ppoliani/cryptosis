import 'whatwg-fetch'
import {task} from 'folktale/data/task';
import {getItem} from '../storage';

export default (url, method='GET', body={}, headers={}) =>
  task(async resolver => {
    try {
      const options = {
        method,
        headers: Object.assign({}, {
          'content-type': 'application/json',
          'Authorization': `Bearer ${getItem('@investreck:access_token')}`
        }, headers)
      };

      if(method !== 'GET') {
        options['body'] = JSON.stringify(body);
      }

      const response = await fetch(url, options);
      if(response.status === 401) window.location.href = '/login';
      if(response.status >= 400) throw new Error(response.status);
      const json = await response.json()
      resolver.resolve(json);
    }
    catch(error) {
      resolver.reject(error);
    }
  });
