import {createAction} from 'redux-actions'
import {fromJS} from 'immutable'
import {combine} from 'most'
import {partial} from '../../../../common/core/fn'
import {btc$, bch$, eth$, xrp$, xtz$} from '../../../../common/sockets/streams'
import {calculateTotalPortfolioValue} from '../../../../common/aggregators'
import {changePriceToSelectedCurrency} from '../../../../common/fx'
import {setPortfolioValue} from '../portfolio/portfolioActions'
import {setPrices} from '../prices/priceActions'
import {getPartialInvestment$, getPriceObjFromStreamData, getFX$} from './common'

export const SET_PORTFOLIO_SUBSCRIPTION = 'STREAM::SET_PORTFOLIO_SUBSCRIPTION'
const setPortfolioSubscription = createAction(SET_PORTFOLIO_SUBSCRIPTION);

export const startPortfolioStream = currency => dispatch => {
  const observer = {
    next: (dispatch) ['∘'] (setPortfolioValue),
    error: errorValue => console.log(`Error in the observer of the portfolio stream: ${errorValue}`)
  }

  const getPrices = (investments, btc, bch, eth, xrp, xtz, fx)  => {
    return {
      investments: fromJS(investments.result).map(partial(changePriceToSelectedCurrency, currency, fx)),
      prices: fromJS({
        BTX: getPriceObjFromStreamData(btc),
        BCH: getPriceObjFromStreamData(bch),
        ETH: getPriceObjFromStreamData(eth),
        XRP: getPriceObjFromStreamData(xrp),
        XTZ: getPriceObjFromStreamData(xtz)
      })
    }
  }

  const keepPrices = obj => obj.prices;

  const streams$ = [btc$(currency), bch$(currency), eth$(currency), xrp$(currency), xtz$(currency), getFX$(currency)];
  const subscription = combine(getPrices, getPartialInvestment$(), ...streams$)
    .debounce(2000)
    .tap((dispatch) ['∘'] (setPrices) ['∘'] (keepPrices))
    .chain(calculateTotalPortfolioValue)
    .subscribe(observer);

  dispatch(setPortfolioSubscription(subscription));
}
