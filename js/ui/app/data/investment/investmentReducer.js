import {handleActions} from 'redux-actions';
import {Map} from 'immutable';
import identity from 'folktale/core/lambda/identity';
import {
  SAVE_NEW_INVESTMENT,
  GET_INVESTMENT_TYPES,
  SAVE_NEW_INVESTMENT_TYPE,
  UPDATE_INVESTMENT_TYPE,
  DELETE_INVESTMENT_TYPE
} from './investmentActions';
import AsyncData from '../core/AsyncData';

const handleSaveInvestment = (state, {payload: saveInvestmentResult}) =>
  saveInvestmentResult.matchWith({
    Empty: identity,
    Loading: () => state.set('saveInvestmentResult', saveInvestmentResult),
    Success: ({data: investment}) => state
      .set('saveInvestmentResult', saveInvestmentResult)
      .set(['investments', investment.id], investment),
    Failure: () => state.set('saveInvestmentResult', saveInvestmentResult),
  });

const handleSetInvestmentTypes = (state, {payload: investmentTypeResult}) =>
  investmentTypeResult.matchWith({
    Empty: identity,
    Loading: () => state.set('fetchInvestmentTypeResult', investmentTypeResult),
    Success: ({data}) => state
      .set('fetchInvestmentTypeResult', investmentTypeResult)
      .updateIn(
        ['investmentTypes'],
        investmentTypes => investmentTypes.concat(Map(data.result))
      ),
    Failure: () => state.set('fetchInvestmentTypeResult', investmentTypeResult),
  });

const handleSaveInvestmentType = (state, {payload: saveInvestmentTypeResult}) =>
  saveInvestmentTypeResult.matchWith({
    Empty: identity,
    Loading: () => state.set('saveInvestmentTypeResult', saveInvestmentTypeResult),
    Success: ({data}) => state
      .set('saveInvestmentTypeResult', saveInvestmentTypeResult)
      .updateIn(['investmentTypes'], investmentTypes => investmentTypes.set(data.result.id, data.result)),
    Failure: () => state.set('saveInvestmentTypeResult', saveInvestmentTypeResult),
  });

const handleDeleteInvestmentType  = (state, {payload: investmentTypeResult}) =>
  investmentTypeResult.matchWith({
    Empty: identity,
    Loading: () => state.set('deleteInvestmentTypeResult', investmentTypeResult),
    Success: ({data}) => state
      .set('deleteInvestmentTypeResult', investmentTypeResult)
      .updateIn(['investmentTypes'], investmentTypes => investmentTypes.delete(data.result.id)),
    Failure: () => state.set('deleteInvestmentTypeResult', investmentTypeResult),
  });

const InvestmentData = Map({
  fetchInvestmentResult: AsyncData.Empty(),
  saveInvestmentResult: AsyncData.Empty(),
  fetchInvestmentTypeResult: AsyncData.Empty(),
  saveInvestmentTypeResult: AsyncData.Empty(),
  deleteInvestmentTypeResult: AsyncData.Empty(),
  investments: Map(),
  investmentTypes: Map()
});

export default handleActions({
  [SAVE_NEW_INVESTMENT]: handleSaveInvestment,
  [GET_INVESTMENT_TYPES]: handleSetInvestmentTypes,
  [SAVE_NEW_INVESTMENT_TYPE]: handleSaveInvestmentType,
  [UPDATE_INVESTMENT_TYPE]: handleSaveInvestmentType,
  [DELETE_INVESTMENT_TYPE]: handleDeleteInvestmentType
}, InvestmentData);

