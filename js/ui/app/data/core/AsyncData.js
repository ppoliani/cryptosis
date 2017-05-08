import data from 'folktale/core/adt/data';

export default data('AsyncData', {
  Empty: () => true,
  Loading: () => true,
  Success: data => ({data}),
  Failure: error => ({error})
});
