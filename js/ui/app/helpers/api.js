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
          'Authorization': `Bearer ${getItem('@bartr:access_token')}`
        }, headers)
      };

      if(method !== 'GET') {
        options['body'] = JSON.stringify(body);
      }

      const response = await fetch(url, options);
      const json = await response.json()
      resolver.resolve(json);
    }
    catch(error) {
      resolver.reject(error);
    }
  });
