import {createAction} from 'redux-actions';
import fetch from '../../helpers/api';

export const SET_PORTFOLIO_TOTAL_VALUE = 'PORTFOLIO::SET_PORTFOLIO_TOTAL_VALUE';
export const SET_LAST_30_DAYS = 'PORTFOLIO::SET_LAST_30_DAYS';
export const SET_INVESTMENT_CURRENT_VALUE = 'PORTFOLIO::SET_INVESTMENT_CURRENT_VALUE';

export const setPortfolioValue = createAction(SET_PORTFOLIO_TOTAL_VALUE);
export const setLast30Days = createAction(SET_LAST_30_DAYS);
export const setInvestmentCurrentValue = createAction(SET_INVESTMENT_CURRENT_VALUE);
