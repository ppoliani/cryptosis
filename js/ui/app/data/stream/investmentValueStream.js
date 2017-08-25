import {createAction} from 'redux-actions'
import {combine} from 'most'
import {fromJS} from 'immutable'
import {partial} from '../../../../common/core/fn'
import {btc$, bch$, eth$, xrp$, xtz$} from '../../../../common/sockets/streams'
import {calculateInvestmentValues} from '../../../../common/aggregators'
import {changePriceToSelectedCurrency} from '../../../../common/fx'
import {setInvestmentCurrentValue} from '../portfolio/portfolioActions'
import {getPartialInvestment$, getPriceObjFromStreamData, fx$} from './common'

export const SET_INVESTMENT_CURRENT_VALUE_SUBSCRIPTION= 'STREAM::SET_INVESTMENT_CURRENT_VALUE_SUBSCRIPTION'
const setInvestmentCurrentValueSuscription = createAction(SET_INVESTMENT_CURRENT_VALUE_SUBSCRIPTION);


// value for each investment individually
export const startInvestmentCurrentValueStream = currency => dispatch => {
  const observer = {
    next: (dispatch) ['∘'] (setInvestmentCurrentValue),
    error: errorValue => console.log(`Error in the observer of the investment values stream: ${errorValue}`)
  }

  const getPrices = (investments, btc, bch, eth, xrp, xtz, fx)  => {
    const getPriceFromStream = partial(getPriceObjFromStreamData, currency, fx);

    return {
      investments: fromJS(investments.result).map(partial(changePriceToSelectedCurrency, currency, fx.get(currency))),
      prices: fromJS({
        BTC: getPriceFromStream(btc),
        BCH: getPriceFromStream(bch),
        ETH: getPriceFromStream(eth),
        XRP: getPriceFromStream(xrp),
        XTZ: getPriceFromStream(xtz)
      })
    }
  }

  const streams$ = [btc$(currency), bch$(currency), eth$(currency), xrp$(currency), xtz$(currency), fx$];
  const subscription = combine(getPrices, getPartialInvestment$(), ...streams$)
    .map(calculateInvestmentValues)
    .subscribe(observer);

  dispatch(setInvestmentCurrentValueSuscription(subscription));
}
