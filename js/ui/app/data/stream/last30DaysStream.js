import {createAction} from 'redux-actions'
import {combine} from 'most'
import {fromJS} from 'immutable'
import {partial} from '../../../../common/core/fn'
import {calculateHistoricPortfolioValues} from '../../../../common/aggregators'
import {changePriceToSelectedCurrency} from '../../../../common/fx'
import {setLast30Days} from '../portfolio/portfolioActions'
import {getPartialInvestment$, getBTC$, getBCH$, getETH$, getXRP$, getXTZ$, fx$} from './common'

export const SET_LAST_30_DAYS_SUBSCRIPTION = 'STREAM::SET_LAST_30_DAYS_SUBSCRIPTION'
const setLast30DaysSubscription = createAction(SET_LAST_30_DAYS_SUBSCRIPTION);

export const startLast30DaysStream = currency => dispatch => {
  const observer = {
    next: (dispatch) ['∘'] (setLast30Days),
    error: errorValue => console.log(`Error in the observer of the portfolio stream: ${errorValue}`)
  }

  const getPriceObj = (symbol, response) => response.Data.map(i => ({
    price: i.close,
    market: '',
    symbol,
    day: i.time * 1000 // unix time to js
  }))

  const getPrices = (investments, btc, bch, eth, xrp, xtz, fx)  => ({
    // map though investments and convert price of purchase into the currenlty selected currency
    investments: fromJS(investments.result).map(partial(changePriceToSelectedCurrency, currency, fx.get(currency))),
    prices: fromJS({
      BTX: getPriceObj('BTX', btc),
      BCH: getPriceObj('BCH', bch),
      ETH: getPriceObj('ETH', eth),
      XRP: getPriceObj('XRP', xrp),
      XTZ: getPriceObj('XTZ', xtz)
    })
  })

  const streams$ = [getPartialInvestment$(), getBTC$(currency), getBCH$(currency), getETH$(currency), getXRP$(currency), getXTZ$(currency), fx$];
  const subscription = combine(getPrices, ...streams$)
    .map(calculateHistoricPortfolioValues)
    .subscribe(observer);

  dispatch(setLast30DaysSubscription(subscription));
}
