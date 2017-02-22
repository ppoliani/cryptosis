import { taggedSum } from 'daggy';

export default taggedSum('RemoteData', {
  Empty: [],
  Loading: [],
  Failure: ['error'],
  Success: ['data'],
});
