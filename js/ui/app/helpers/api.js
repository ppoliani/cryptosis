import { task } from 'folktale/data/task';

export default (url, method='GET', headers) =>
  task(async resolver => {
    try {
      const options = {
        method,
        headers: new Headers(headers)
      };

      const response = await fetch(url, options);
      response.json().then(resolver.resolve)
    }
    catch(error) {
      resolver.reject(error);
    }
  });
