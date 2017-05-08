import {createAction} from 'redux-actions';
import fetch from '../../helpers/api';
import {partial} from '../../helpers/fn';

import {task} from 'folktale/data/task';

const INVESTMENT_ENDPOINT = `${process.env.API_URL}/investments`;
const INVESTMENT_TYPE_ENDPOINT = `${process.env.API_URL}/investments/types`;

export const SAVE_NEW_INVESTMENT = 'INVESTMENT::SAVE_NEW_INVESTMENT';
export const SAVE_NEW_INVESTMENT_TYPE = 'INVESTMENT::SAVE_NEW_INVESTMENT_TYPE';

const saveInvestmentRoot = fetch => {
  const saveInvestmentResult = partial(fetch, INVESTMENT_ENDPOINT, 'POST');

  return createAction(
    SAVE_NEW_INVESTMENT,
    saveInvestmentResult
  );
}

const saveInvestmentTypeRoot = fetch => {
  const saveInvestmentTypeResult = partial(fetch, INVESTMENT_TYPE_ENDPOINT, 'POST');

  return createAction(
    SAVE_NEW_INVESTMENT_TYPE,
    saveInvestmentTypeResult
  );
}

const fakeFetch = (_, __, investment) => task(resolver => {
  console.log('>>>', investment);
  setTimeout(
    () => resolver.resolve({id: 1}),
    2000
  );
});

export const saveInvestment = saveInvestmentRoot(fakeFetch);
export const saveInvestmentType = saveInvestmentTypeRoot(fakeFetch);
