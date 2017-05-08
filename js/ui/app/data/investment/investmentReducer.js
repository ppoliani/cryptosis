import {handleActions} from 'redux-actions';
import {Map} from 'immutable';
import identity from 'folktale/core/lambda/identity';
import {SAVE_NEW_INVESTMENT, SAVE_NEW_INVESTMENT_TYPE} from './investmentActions';
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

const handleSaveInvestmentType = (state, {payload: saveInvestmentTypeResult}) =>
  saveInvestmentTypeResult.matchWith({
    Empty: identity,
    Loading: () => state.set('saveInvestmentTypeResult', saveInvestmentTypeResult),
    Success: ({data: investmentType}) => state
      .set('saveInvestmentTypeResult', saveInvestmentTypeResult)
      .set(['investments', investmentType.id], investmentType),
    Failure: () => state.set('saveInvestmentTypeResult', saveInvestmentTypeResult),
  });

const setInvestmentList = (state, {payload: investments}) => state.set('investments', investments);
const updateInvestment= (state, {payload: investment}) => state.updateIn(['investments', investment.id], list => list.push(investment));

const InvestmentData = Map({
  saveInvestmentResult: AsyncData.Empty(),
  saveInvestmentTypeResult: AsyncData.Empty(),
  investments: AsyncData.Empty(),
  investmentTypes: AsyncData.Empty()
});

export default handleActions({
  [SAVE_NEW_INVESTMENT]: handleSaveInvestment,
  [SAVE_NEW_INVESTMENT_TYPE]: handleSaveInvestmentType
}, InvestmentData);

