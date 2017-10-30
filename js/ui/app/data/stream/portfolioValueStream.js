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

export const startPortfolioStream = currency => (dispatch, getState) => {
  const observer = {
    next: (dispatch) ['∘'] (setPortfolioValue),
    error: errorValue => {
      console.log(`Error in the observer of the portfolio stream: ${errorValue}`)
    }
  }

  const getPrices = (investments, price, fx)  => {
    const {prices} = getState(); 
    const priceData = getPriceObjFromStreamData(currency, fx, price);
    const updatedInvestments = fromJS(investments.result)
      .map(
        partial(changePriceToSelectedCurrency, currency, fx.get(currency))
      );

    return {
      investments: updatedInvestments,
      price: fromJS(priceData),
      fx: prices
    }
  }

  const keepPrices = obj => obj.price;
  const streams$ = [priceStream$(currency), fx$(currency)];
  const subscription = combine(getPrices, getPartialInvestment$(), ...streams$)
      .tap((dispatch) ['∘'] (setPrices) ['∘'] (keepPrices))
      .map(calculateTotalPortfolioValue)
      .subscribe(observer);

  dispatch(setPortfolioSubscription(subscription));
}
