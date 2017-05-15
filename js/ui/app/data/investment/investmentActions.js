import {createAction} from 'redux-actions';
import compose from 'folktale/core/lambda/compose';
import map from 'folktale/core/fantasy-land/map';
import {Map} from 'immutable';
import fetch, {constructUrl} from '../../helpers/api';
import {partial} from '../../helpers/fn';
import {task} from 'folktale/data/task';

const INVESTMENT_ENDPOINT = `${process.env.API_URL}/investments`;
const INVESTMENT_TYPE_ENDPOINT = `${process.env.API_URL}/investment/types`;

export const GET_INVESTMENTS = 'INVESTMENT::GET_INVESTMENTS';
export const SAVE_NEW_INVESTMENT = 'INVESTMENT::SAVE_NEW_INVESTMENT';
export const UPDATE_INVESTMENT = 'INVESTMENT::UPDATE_INVESTMENT';
export const DELETE_INVESTMENT = 'INVESTMENT::DELETE_INVESTMENT';

export const GET_INVESTMENT_TYPES = 'INVESTMENT::GET_INVESTMENT_TYPES';
export const SAVE_NEW_INVESTMENT_TYPE = 'INVESTMENT::SAVE_NEW_INVESTMENT_TYPE';
export const UPDATE_INVESTMENT_TYPE = 'INVESTMENT::UPDATE_INVESTMENT_TYPE';
export const DELETE_INVESTMENT_TYPE = 'INVESTMENT::DELETE_INVESTMENT_TYPE';

const getInvestmentUrl = investment => `${INVESTMENT_ENDPOINT}/${investment.get('id')}`;
const getInestmentTypeUrl = investmentType => `${INVESTMENT_TYPE_ENDPOINT}/${investmentType.get('id')}`;

const getInvestmentsRoot = fetch => {
  const getUrl = ({skip, limit}) => constructUrl(INVESTMENT_ENDPOINT, Map({skip, limit}));
  const fetchData = compose(partial(fetch, 'GET'), getUrl);

  return createAction(
    GET_INVESTMENTS,
    fetchData
  );
}

const updateInvestmentRoot = fetch => {
  const fetchData = investment => fetch('PUT', getInvestmentUrl(investment), investment);

  return createAction(
    UPDATE_INVESTMENT,
    fetchData
  );
}

const saveInvestmentRoot = fetch => {
  const saveInvestmentResult = partial(fetch, 'POST', INVESTMENT_ENDPOINT);

  return createAction(
    SAVE_NEW_INVESTMENT,
    saveInvestmentResult
  );
}

const deleteInvestmentRoot = fetch => {
  const fetchData = investment => fetch('DELETE', getInvestmentUrl(investment), investment.toJS());

  return createAction(
    DELETE_INVESTMENT,
    fetchData
  );
}

const getInvestmentTypesRoot = fetch => {
  const getUrl = ({skip, limit}) => constructUrl(INVESTMENT_TYPE_ENDPOINT, Map({skip, limit}));
  const fetchData = compose(partial(fetch, 'GET'), getUrl);

  return createAction(
    GET_INVESTMENT_TYPES,
    fetchData
  );
}

const saveInvestmentTypeRoot = fetch => {
  const saveInvestmentTypeResult = partial(fetch, 'POST', INVESTMENT_TYPE_ENDPOINT);

  return createAction(
    SAVE_NEW_INVESTMENT_TYPE,
    saveInvestmentTypeResult
  );
}

const updateInvestmentTypeRoot = fetch => {
  const fetchData = investmentType => fetch('PUT', getInestmentTypeUrl(investmentType), investmentType);

  return createAction(
    UPDATE_INVESTMENT_TYPE,
    fetchData
  );
}

const deleteInvestmentTypeRoot = fetch => {
  const fetchData = investmentType => fetch('DELETE', getInestmentTypeUrl(investmentType), investmentType.toJS());

  return createAction(
    DELETE_INVESTMENT_TYPE,
    fetchData
  );
}

export const getInvestments = getInvestmentsRoot(fetch);
export const saveInvestment = saveInvestmentRoot(fetch);
export const updateInvestment = updateInvestmentRoot(fetch);
export const deleteInvestment = deleteInvestmentRoot(fetch);

export const getInvestmentTypes = getInvestmentTypesRoot(fetch);
export const saveInvestmentType = saveInvestmentTypeRoot(fetch);
export const updateInvestmentType = updateInvestmentTypeRoot(fetch);
export const deleteInvestmentType = deleteInvestmentTypeRoot(fetch);
