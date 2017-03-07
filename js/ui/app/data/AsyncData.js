import { taggedSum } from 'daggy';

export default taggedSum('AsyncData', {
  Empty: [],
  Loading: [],
  Failure: ['error'],
  Success: ['data'],
});
