import { task } from 'folktale/data/task';

export default url =>
  task(async resolver => {
    try {
      const response = await fetch(url);
      response.json().then(resolver.resolve)
    }
    catch(error) {
      resolver.reject(error);
    }
  });
