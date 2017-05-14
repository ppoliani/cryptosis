import data from 'folktale/core/adt/data';

const allSuccess = asyncDataList => asyncDataList.every(
  a => a.matchWith({
    Empty: () => false,
    Loading: () => false,
    Success: () => true,
    Failure: () => false
  })
);

export const AsyncDataAll = asyncDataList => {
  return allSuccess(asyncDataList)
    ? AsyncData.Success()
    : AsyncData.Loading();
};

const AsyncData = data('AsyncData', {
  Empty: () => true,
  Loading: () => true,
  Success: data => ({data}),
  Failure: error => ({error})
});

export default AsyncData;
