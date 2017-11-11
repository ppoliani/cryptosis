import {createAction} from 'redux-actions'
import {map} from 'folktale/core/lambda'
import {Map} from 'immutable'
import fetch, {constructUrl} from '../../services/api'
import {partial} from '../../../../common/core/fn'
import config from '../../services/config'

const INVESTMENT_COUNT_ENDPOINT = `${config.API_URL}/investments/count`;
const INVESTMENT_ENDPOINT = `${config.API_URL}/investments`;

export const GET_PARTIAL_INVESTMENTS = 'INVESTMENT::GET_PARTIAL_INVESTMENTS'
export const GET_INVESTMENTS_COUNT = 'INVESTMENT::GET_INVESTMENTS_COUNT';
export const GET_INVESTMENTS = 'INVESTMENT::GET_INVESTMENTS'
export const GET_INVESTMENT = 'INVESTMENT::GET_INVESTMENT'
export const SAVE_NEW_INVESTMENT = 'INVESTMENT::SAVE_NEW_INVESTMENT'
export const UPDATE_INVESTMENT = 'INVESTMENT::UPDATE_INVESTMENT'
export const DELETE_INVESTMENT = 'INVESTMENT::DELETE_INVESTMENT'

const getInvestmentIdUrl = investmentId => `${INVESTMENT_ENDPOINT}/${investmentId}`;
const getInvestmentUrl = investment => `${INVESTMENT_ENDPOINT}/${investment.get('id')}`;

const getPartialInvestmentsRoot = fetch => {
  const fetchData = partial(fetch, 'GET', `${INVESTMENT_ENDPOINT}/partial`);

  return createAction(
    GET_PARTIAL_INVESTMENTS,
    fetchData
  );
}

const getInvestmentRoot = fetch => {
  const fetchData = investmentId => fetch('GET', getInvestmentIdUrl(investmentId));

  return createAction(
    GET_INVESTMENT,
    fetchData
  );
}

const getInvestmentsCountRoot = fetch => {
  return createAction(
    GET_INVESTMENTS_COUNT,
    partial(fetch, 'GET', INVESTMENT_COUNT_ENDPOINT)
  );
}

const getInvestmentsRoot = fetch => {
  const getUrl = ({skip=0, limit=10}) => constructUrl(INVESTMENT_ENDPOINT, Map({skip, limit}));
  const fetchData = (partial(fetch, 'GET')) ['∘'] (getUrl);

  return createAction(
    GET_INVESTMENTS,
    fetchData
  );
}

const transform = investment => investment.map(
  (v, k) => ['price', 'quantity', 'expenses', 'moneyInvested', 'date'].includes(k)
    ? Number(v)
    : v
)

const updateInvestmentRoot = fetch => {
  const fetchData = investment => fetch('PUT', getInvestmentUrl(investment), investment);

  return createAction(
    UPDATE_INVESTMENT,
    (fetchData) ['∘'] (transform)
  );
}

const saveInvestmentRoot = fetch => {
  const saveInvestmentResult = partial(fetch, 'POST', INVESTMENT_ENDPOINT);
  
  return createAction(
    SAVE_NEW_INVESTMENT,
    (saveInvestmentResult) ['∘'] (transform)
  );
}

const deleteInvestmentRoot = fetch => {
  const fetchData = investment => fetch('DELETE', getInvestmentUrl(investment), investment.toJS());

  return createAction(
    DELETE_INVESTMENT,
    fetchData
  )
}


export const getPartialInvestments = getPartialInvestmentsRoot(fetch)
export const getInvestmentsCount = getInvestmentsCountRoot(fetch)
export const getInvestments = getInvestmentsRoot(fetch)
export const getInvestment = getInvestmentRoot(fetch)
export const saveInvestment = saveInvestmentRoot(fetch)
export const updateInvestment = updateInvestmentRoot(fetch)
export const deleteInvestment = deleteInvestmentRoot(fetch)
