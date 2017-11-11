import {handleActions} from 'redux-actions'
import {Map, fromJS} from 'immutable'
import identity from 'folktale/core/lambda/identity'
import AsyncData from '../core/AsyncData'
import {

} from './transactionActions'

const stringToDate = records => records.map(
  v => {
    return v.set('date', new Date(v.get('date')))
  }
)

const handleSetPartialInvestments = (state, {payload: investmentsResult}) =>
  investmentsResult.matchWith({
    Empty: identity,
    Loading: () => state.set('fetchPartialInvestmentsResult', investmentsResult),
    Success: ({data}) => state
      .set('fetchPartialInvestmentsResult', investmentsResult)
      .set('partialInvestments',  fromJS(data.result)),
    Failure: () => state.set('fetchInvestmentTypeResult', investmentsResult),
  });

const handleSaveInvestment = (state, {payload: saveInvestmentResult}) =>
  saveInvestmentResult.matchWith({
    Empty: identity,
    Loading: () => state.set('saveInvestmentResult', saveInvestmentResult),
    Success: ({data: {result: [result]}}) => state
      .set('saveInvestmentResult', saveInvestmentResult)
      .updateIn(
        ['investments'],
        investments => {
          return investments.set(result.id, fromJS(result))
        }),
    Failure: () => state.set('saveInvestmentResult', saveInvestmentResult),
  });

const handleSetInvestmentsCount = (state, {payload: investmentsCountResult}) => {
  return investmentsCountResult.matchWith({
    Empty: identity,
    Loading: () => state.set('fetchInvestmentsCountResult', investmentsCountResult),
    Success: ({data: {result: [result]}}) => state
      .set('fetchInvestmentsCountResult', investmentsCountResult)
      .set('count', result.count),
    Failure: () => state.set('investmentsCountResult', investmentsCountResult),
  });
}
const handleSetInvestments = (state, {payload: investmentsResult}) =>
  investmentsResult.matchWith({
    Empty: identity,
    Loading: () => state.set('fetchInvestmentsResult', investmentsResult),
    Success: ({data}) => state
      .set('fetchInvestmentsResult', investmentsResult)
      .set('investments', stringToDate(fromJS(data.result))),
    Failure: () => state.set('fetchInvestmentTypeResult', investmentsResult),
  });

const handleDeleteInvestment = (state, {payload: investmentResult}) =>
  investmentResult.matchWith({
    Empty: identity,
    Loading: () => state.set('deleteInvestmentResult', investmentResult),
    Success: ({data: {result}}) => state
      .set('deleteInvestmentResult', investmentResult)
      .updateIn(['investments'], investments => investments.delete(`${result.id}`)),
    Failure: () => state.set('deleteInvestmentResult', investmentResult),
  });

const transactionModel = Map({
  fetchPartialInvestmentsResult: AsyncData.Empty(),
  fetchInvestmentsCountResult: AsyncData.Empty(),
  fetchInvestmentsResult: AsyncData.Empty(),
  saveInvestmentResult: AsyncData.Empty(),
  fetchInvestmentTypeResult: AsyncData.Empty(),
  saveInvestmentTypeResult: AsyncData.Empty(),
  deleteInvestmentTypeResult: AsyncData.Empty(),
  partialInvestments: Map(),
  count: 0,
  investments: Map(),
  investmentTypes: Map()
});

export default handleActions({
  [GET_PARTIAL_INVESTMENTS]: handleSetPartialInvestments,
  [GET_INVESTMENTS_COUNT]: handleSetInvestmentsCount,
  [GET_INVESTMENTS]: handleSetInvestments,
  [GET_INVESTMENT]: handleSaveInvestment,
  [SAVE_NEW_INVESTMENT]: handleSaveInvestment,
  [UPDATE_INVESTMENT]: handleSaveInvestment,
  [DELETE_INVESTMENT]: handleDeleteInvestment,
  [GET_INVESTMENT_TYPES]: handleSetInvestmentTypes,
  [SAVE_NEW_INVESTMENT_TYPE]: handleSaveInvestmentType,
  [UPDATE_INVESTMENT_TYPE]: handleSaveInvestmentType,
  [DELETE_INVESTMENT_TYPE]: handleDeleteInvestmentType
}, transactionModel)
