import data from 'folktale/core/adt/data';

const allSuccess = asyncDataList => asyncDataList.every(
  a => a.matchWith({
    Empty: () => false,
    Loading: () => false,
    Success: () => true,
    Failure: () => false
  })
)

const someSuccess = asyncDataList => asyncDataList.some(
  a => a.matchWith({
    Empty: () => false,
    Loading: () => false,
    Success: () => true,
    Failure: () => false
  })
)

// AsyncData[] -> AsyncData
// if any success return success
export const AsyncDataSome = asyncDataList =>
  someSuccess(asyncDataList)
    ? AsyncData.Success()
    : AsyncData.Loading()

// AsyncData[] -> AsyncData
// if all success return success
export const AsyncDataAll = asyncDataList =>
  allSuccess(asyncDataList)
    ? AsyncData.Success()
    : AsyncData.Loading()

const AsyncData = data('AsyncData', {
  Empty: () => true,
  Loading: () => true,
  Success: data => ({data}),
  Failure: error => ({error})
})

export default AsyncData;
