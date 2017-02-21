import { task } from 'folktale/data/task';

export default url =>
  task(async resolver => {
    const response = await fetch(url);

    response.json()
      .then(resolver.resolve)
      .catch(resolver.reject);
  });
