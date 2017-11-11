import {createAction} from 'redux-actions'
import fetch from '../../services/api'

export const SET_PORTFOLIO_TOTAL_VALUE = 'PORTFOLIO::SET_PORTFOLIO_TOTAL_VALUE'
export const SET_LAST_30_DAYS = 'PORTFOLIO::SET_LAST_30_DAYS'
export const SET_TRANSACTIONS_CURRENT_VALUE = 'PORTFOLIO::SET_TRANSACTIONS_CURRENT_VALUE'

export const setPortfolioValue = createAction(SET_PORTFOLIO_TOTAL_VALUE)
export const setLast30Days = createAction(SET_LAST_30_DAYS)
export const setTransactionsCurrentValue = createAction(SET_TRANSACTIONS_CURRENT_VALUE)
