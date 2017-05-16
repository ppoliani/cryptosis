import {createAction} from 'redux-actions';
import fetch from '../../helpers/api';

export const SET_PORTFOLIO_TOTAL_VALUE = 'PORTFOLIO::SET_PORTFOLIO_TOTAL_VALUE';
export const SET_LAST_30_DAYS = 'PORTFOLIO::SET_LAST_30_DAYS';

const historicalDataUrl = (fromSymbol, toSymbol, timestamp, days) =>
  `https://min-api.cryptocompare.com/data/histoday?fsym=${fromSymbol}&tsym=${toSymbol}&limit=${days}&aggregate=1&toTs=${timestamp}`

export const setPortfolioValue = createAction(SET_PORTFOLIO_TOTAL_VALUE);
export const setLast30Days = createAction(SET_LAST_30_DAYS);
