import {createAction} from 'redux-actions'
import {fromJS} from 'immutable'
import {combine, throwError, fromPromise} from 'most'
import {partial} from '../../../../common/core/fn'
import {priceStream$} from '../../../../common/sockets/streams'
import {calculateTotalPortfolioValue} from '../../../../common/aggregators'
import {changePriceToSelectedCurrency} from '../../../../common/fx'
import {setPortfolioValue} from '../portfolio/portfolioActions'
import {setPrices} from '../prices/priceActions'
import {getPartialInvestment$, getPriceObjFromStreamData, fx$} from './common'

export const SET_PORTFOLIO_SUBSCRIPTION = 'STREAM::SET_PORTFOLIO_SUBSCRIPTION'
const setPortfolioSubscription = createAction(SET_PORTFOLIO_SUBSCRIPTION);

export const startPortfolioStream = currency => dispatch => {
  const observer = {
    next: (dispatch) ['∘'] (setPortfolioValue),
    error: errorValue => {
      console.log(`Error in the observer of the portfolio stream: ${errorValue}`)
    }
  }

  const getPrices = (investments, prices, fx)  => {
    const priceData = getPriceObjFromStreamData(currency, fx, prices);

    return {
      investments: fromJS(investments.result).map(partial(changePriceToSelectedCurrency, currency, fx.get(currency))),
      prices: fromJS(priceData)
    }
  }

  const keepPrices = obj => obj.prices;
  const streams$ = [priceStream$(currency), fx$()];
  const subscription = combine(getPrices, getPartialInvestment$(), ...streams$)
      .tap((dispatch) ['∘'] (setPrices) ['∘'] (keepPrices))
      .map(calculateTotalPortfolioValue)
      .subscribe(observer);

  dispatch(setPortfolioSubscription(subscription));
}
