import {handleActions} from 'redux-actions'
import {Map, fromJS} from 'immutable'
import identity from 'folktale/core/lambda/identity'
import AsyncData from '../core/AsyncData'
import {
  GET_PARTIAL_TRANSACTIONS,
  GET_TRANSACTIONS_COUNT,
  GET_TRANSACTIONS,
  GET_TRANSACTION,
  CREATE_NEW_TRANSACTION,
  UPDATE_TRANSACTION,
  DELETE_TRANSACTION
} from './transactionActions'

const stringToDate = records => records.map(
  v => {
    return v.set('date', new Date(v.get('date')))
  }
)

const handleSetPartialTransactions = (state, {payload: fetchPartialTxnResult}) =>
  fetchPartialTxnResult.matchWith({
    Empty: identity,
    Loading: () => state.set('fetchPartialTxnResult', fetchPartialTxnResult),
    Success: ({data}) => state
      .set('fetchPartialTxnResult', fetchPartialTxnResult)
      .set('partialTransactions',  fromJS(data.result)),
    Failure: () => state.set('fetchPartialTxnResult', fetchPartialTxnResult),
  });

const handleSaveTransaction = (state, {payload: saveTxnResult}) =>
  saveTxnResult.matchWith({
    Empty: identity,
    Loading: () => state.set('saveTxnResult', saveTxnResult),
    Success: ({data: {result: [result]}}) => state
      .set('saveTxnResult', saveTxnResult)
      .updateIn(
        ['transactions'],
        txns => {
          return txns.set(result.id, fromJS(result))
        }),
    Failure: () => state.set('saveTxnResult', saveTxnResult),
  });

const handleSetTxnCount = (state, {payload: fetchTxnCountResult}) => {
  return fetchTxnCountResult.matchWith({
    Empty: identity,
    Loading: () => state.set('fetchTxnCountResult', fetchTxnCountResult),
    Success: ({data: {result: [result]}}) => state
      .set('fetchTxnCountResult', fetchTxnCountResult)
      .set('count', result.count),
    Failure: () => state.set('fetchTxnCountResult', fetchTxnCountResult),
  });
}
const handleSetTransactions = (state, {payload: fetchTxnsResult}) =>
  fetchTxnsResult.matchWith({
    Empty: identity,
    Loading: () => state.set('fetchTxnsResult', fetchTxnsResult),
    Success: ({data}) => state
      .set('fetchTxnsResult', fetchTxnsResult)
      .set('transactions', stringToDate(fromJS(data.result))),
    Failure: () => state.set('fetchTxnsResult', fetchTxnsResult),
  });

const handleDeleteTransaction = (state, {payload: deleteTxnResult}) =>
  deleteTxnResult.matchWith({
    Empty: identity,
    Loading: () => state.set('deleteTxnResult', deleteTxnResult),
    Success: ({data: {result}}) => state
      .set('deleteTxnResult', deleteTxnResult)
      .updateIn(['transactions'], txns => txns.delete(`${result.id}`)),
    Failure: () => state.set('deleteTxnResult', deleteTxnResult),
  });

const TransactionModel = Map({
  fetchPartialTxnResult: AsyncData.Empty(),
  fetchTxnCountResult: AsyncData.Empty(),
  fetchTxnsResult: AsyncData.Empty(),
  deleteTxnResult: AsyncData.Empty(),
  saveTxnResult: AsyncData.Empty(),
  partialTransactions: Map(),
  count: 0,
  transactions: Map()
});

export default handleActions({
  [GET_PARTIAL_TRANSACTIONS]: handleSetPartialTransactions,
  [GET_TRANSACTIONS_COUNT]: handleSetTxnCount,
  [GET_TRANSACTIONS]: handleSetTransactions,
  [CREATE_NEW_TRANSACTION]: handleSaveTransaction,
  [UPDATE_TRANSACTION]: handleSaveTransaction,
  [DELETE_TRANSACTION]: handleDeleteTransaction,
}, TransactionModel)
