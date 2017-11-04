import {createAction} from 'redux-actions'
import {combine, fromPromise} from 'most'
import {fromJS, Map} from 'immutable'
import {partial} from '../../../../common/core/fn'
import {calculateHistoricPortfolioValues} from '../../../../common/aggregators'
import {changePriceToSelectedCurrency, convertToBaseCurrency} from '../../../../common/fx'
import {MINUTE} from '../../../../common/constants/time'
import {setLast30Days} from '../portfolio/portfolioActions'
import {getPartialInvestment$, createHistoricStreams, fx$, getDistinctInvestmentTypes} from './common'

export const SET_LAST_30_DAYS_SUBSCRIPTION = 'STREAM::SET_LAST_30_DAYS_SUBSCRIPTION'
const setLast30DaysSubscription = createAction(SET_LAST_30_DAYS_SUBSCRIPTION);

export const startLast30DaysStream = currency => dispatch => {
  const observer = {
    next: (dispatch) ['∘'] (setLast30Days),
    error: errorValue => {
      console.log(`Error in the observer of the portfolio stream: ${errorValue}`)
    }
  }

  const getPriceObj = (symbol, response) => fromJS(
    response.Data.map(i => ({
      price: i.close, 
      market: '',
      symbol,
      day: i.time * 1000 // unix time to js
    }))
  )

  const updateInvestments = (investments, fx)  => fromJS(investments.result)
    .map(partial(changePriceToSelectedCurrency, currency, fx.get(currency)))
  
  const getPrices = ({investments, uniqueInvestmentTypes}, ...priceList) => {
    const priceObjReducer =  (acc, pl, index) => {
      const symbol = uniqueInvestmentTypes.get(index)
      return acc.set(symbol, getPriceObj(symbol, pl))
    };

    return {
      investments,
      prices: priceList.reduce(priceObjReducer, Map())
    };
  } 

  const historicStreams = investments => {
    const uniqueInvestmentTypes = getDistinctInvestmentTypes(investments);

    return {
      investments,
      uniqueInvestmentTypes,
      histoStreams$: createHistoricStreams(currency, uniqueInvestmentTypes)
    }
  }

  const subscription = combine(updateInvestments, getPartialInvestment$(), fx$(currency))
    .throttle(MINUTE)
    .map(historicStreams)
    .chain(result => combine(
        partial(getPrices, result), 
        ...result.histoStreams$
      )
    )
    .map(calculateHistoricPortfolioValues)
    .subscribe(observer)

  dispatch(setLast30DaysSubscription(subscription));
}
