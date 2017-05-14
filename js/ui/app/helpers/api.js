import 'whatwg-fetch'
import {List} from 'immutable';
import {task} from 'folktale/data/task';
import {getItem} from '../storage';

export const constructUrl = (url, params) =>
  `
  ${url}?${
    params
      .reduce(
        (acc, v, k) => acc.push(`${k}=${v}`),
        List()
      )
      .join('&')
  }
  `

export default (method, url, body={}, headers={}) =>
  task(async resolver => {
    try {
      const options = {
        method,
        headers: Object.assign({}, {
          'content-type': 'application/json',
          'Authorization': `Bearer ${getItem('@investreck:access_token')}`
        }, headers)
      };

      if(method !== 'GET' && method !== 'DELETE') {
        options['body'] = JSON.stringify(body);
      }

      const response = await fetch(url, options);
      if(response.status === 401) window.location.href = '/login';
      if(response.status >= 400) throw new Error(response.status);
      if(method === 'DELETE' && response.status === 204) return resolver.resolve({result: body});

      const json = await response.json()
      resolver.resolve(json);
    }
    catch(error) {
      console.log('>>>>>', error)
      resolver.reject(error);
    }
  });
