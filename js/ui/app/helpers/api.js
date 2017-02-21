import Task from 'folktale/data/task';

export default url => {
  return new Task.task(async (resolver) => {
    const response = await fetch(url);

    response.json()
      .then(resolver.resolve)
      .catch(resolver.reject);
  })
};
