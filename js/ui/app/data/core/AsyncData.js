import union from 'folktale/adt/union/union';

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

const AsyncData = union('AsyncData', {
  Empty: () => true,
  Loading: () => true,
  Success: data => ({data}),
  Failure: error => ({error})
})

export default AsyncData;
