import {createAction} from 'redux-actions';
import {combine} from 'most';
import {fromJS} from 'immutable';
import compose from 'folktale/core/lambda/compose';
import {calculateHistoricPortfolioValues} from '../../services/aggregators';
import {setLast30Days} from '../portfolio/portfolioActions';
import {getPartialInvestment$, getBTC$, getETH$} from './common';

export const SET_LAST_30_DAYS_SUBSCRIPTION = 'STREAM::SET_LAST_30_DAYS_SUBSCRIPTION';
const setLast30DaysSubscription = createAction(SET_LAST_30_DAYS_SUBSCRIPTION);

export const startLast30DaysStream = () => dispatch => {
  const observer = {
    next: compose(dispatch, setLast30Days),
    error: errorValue => console.log(`Error in the observer of the portfolio stream: ${errorValue}`)
  }

  const getPriceObj = (symbol, response) => response.Data.map(i => ({
    price: i.close,
    market: '',
    symbol,
    day: i.time * 1000 // unix time to js
  }))

  const getPrices = (investments, btc, eth)  => ({
    investments: fromJS(investments.result),
    prices: fromJS({
      BTX: getPriceObj('BTX', btc),
      ETH: getPriceObj('ETH', eth)
    })
  })

  const subscription = combine(getPrices, getPartialInvestment$(), getBTC$(), getETH$())
    .chain(calculateHistoricPortfolioValues)
    .subscribe(observer);

  dispatch(setLast30DaysSubscription(subscription));
}
