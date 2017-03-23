import data from 'folktale/core/adt/data';

export default data('AsyncData', {
  Empty: () => ({}),
  Loading: () => ({}),
  Failure: error => ({error}),
  Success: data => ({data})
});
