import {handleActions} from 'redux-actions';
import {Map, fromJS} from 'immutable';
import identity from 'folktale/core/lambda/identity';
import {
  GET_PARTIAL_INVESTMENTS,
  GET_INVESTMENTS,
  SAVE_NEW_INVESTMENT,
  UPDATE_INVESTMENT,
  DELETE_INVESTMENT,
  GET_INVESTMENT_TYPES,
  SAVE_NEW_INVESTMENT_TYPE,
  UPDATE_INVESTMENT_TYPE,
  DELETE_INVESTMENT_TYPE
} from './investmentActions';
import AsyncData from '../core/AsyncData';

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
      .updateIn(['investments'], investments => investments.delete(result.id)),
    Failure: () => state.set('deleteInvestmentResult', investmentResult),
  });


const handleSetInvestmentTypes = (state, {payload: investmentTypeResult}) =>
  investmentTypeResult.matchWith({
    Empty: identity,
    Loading: () => state.set('fetchInvestmentTypeResult', investmentTypeResult),
    Success: ({data: {result}}) => state
      .set('fetchInvestmentTypeResult', investmentTypeResult)
      .set('investmentTypes', fromJS(result)),
    Failure: () => state.set('fetchInvestmentTypeResult', investmentTypeResult),
  });

const handleSaveInvestmentType = (state, {payload: saveInvestmentTypeResult}) =>
  saveInvestmentTypeResult.matchWith({
    Empty: identity,
    Loading: () => state.set('saveInvestmentTypeResult', saveInvestmentTypeResult),
    Success: ({data: {result: [result]}}) => state
      .set('saveInvestmentTypeResult', saveInvestmentTypeResult)
      .updateIn(['investmentTypes'], investmentTypes => investmentTypes.set(result.id, fromJS(result))),
    Failure: () => state.set('saveInvestmentTypeResult', saveInvestmentTypeResult),
  });

const handleDeleteInvestmentType  = (state, {payload: investmentTypeResult}) =>
  investmentTypeResult.matchWith({
    Empty: identity,
    Loading: () => state.set('deleteInvestmentTypeResult', investmentTypeResult),
    Success: ({data: {result}}) => state
      .set('deleteInvestmentTypeResult', investmentTypeResult)
      .updateIn(['investmentTypes'], investmentTypes => investmentTypes.delete(result.id)),
    Failure: () => state.set('deleteInvestmentTypeResult', investmentTypeResult),
  });

const InvestmentData = Map({
  fetchPartialInvestmentsResult: AsyncData.Empty(),
  fetchInvestmentsResult: AsyncData.Empty(),
  saveInvestmentResult: AsyncData.Empty(),
  fetchInvestmentTypeResult: AsyncData.Empty(),
  saveInvestmentTypeResult: AsyncData.Empty(),
  deleteInvestmentTypeResult: AsyncData.Empty(),
  partialInvestments: Map(),
  investments: Map(),
  investmentTypes: Map()
});

export default handleActions({
  [GET_PARTIAL_INVESTMENTS]: handleSetPartialInvestments,
  [GET_INVESTMENTS]: handleSetInvestments,
  [SAVE_NEW_INVESTMENT]: handleSaveInvestment,
  [UPDATE_INVESTMENT]: handleSaveInvestment,
  [DELETE_INVESTMENT]: handleDeleteInvestment,
  [GET_INVESTMENT_TYPES]: handleSetInvestmentTypes,
  [SAVE_NEW_INVESTMENT_TYPE]: handleSaveInvestmentType,
  [UPDATE_INVESTMENT_TYPE]: handleSaveInvestmentType,
  [DELETE_INVESTMENT_TYPE]: handleDeleteInvestmentType
}, InvestmentData);

