import {List} from 'immutable'
import {task} from 'folktale/concurrency/task'
import {getItem} from './storage'
import config from './config'

export const normalizeFilters = filters => filters.reduce((acc, filter) => {
  return Object.assign({}, acc, {[filter.id]: filter.value})
}, {});

export const constructUrl = (url, params) =>
  `
  ${url}?${
    params
      .reduce(
        (acc, v, k) => v ? acc.push(`${k}=${v}`) : acc,
        List()
      )
      .join('&')
  }
  `

const getAuthHeader = (auth, bearerToken) => auth
  ? {
      'content-type': 'application/json',
      'Authorization': `Bearer ${bearerToken}`
    }
  : {}

export default (method, url, body={}, auth=true, headers={}) =>
  task(async resolver => {
    try {
      const bearerToken = await getItem(config.ACCESS_TOKEN_KEY).run().promise();
      const options = {
        method,
        headers: Object.assign(
          {},
          getAuthHeader(auth, bearerToken),
          headers
        )
      };

      // dissalow body inclusion for methods that don't support it
      if(method !== 'GET' && method !== 'DELETE') {
        options['body'] = JSON.stringify(body);
      }

      const response = await fetch(url, options);
      if(response.status === 401) window.location.href = '/login';
      if(response.status >= 400) throw new Error(response.status);
      // including the deleted resource is usefull for any further actions
      if(method === 'DELETE' && response.status === 204) return resolver.resolve({result: body});

      const json = await response.json()
      resolver.resolve(json);
    }
    catch(error) {
      console.log('>>>>>', error)
      resolver.reject(error);
    }
  })
