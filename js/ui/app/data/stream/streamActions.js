import {createAction} from 'redux-actions';
import {combine, fromPromise} from 'most';
import {fromJS} from 'immutable';
import compose from 'folktale/core/lambda/compose';
import fetch from '../../helpers/api';
import {connect} from '../../services/sockets/cryptoCompare';
import {calculateTotalPortfolioValue, calculateHistoricPortfolioValues} from '../../services/aggregators';
import {setPortfolioValue, setLast30Days} from '../portfolio/portfolioActions';

const INVESTMENT_ENDPOINT = `${process.env.API_URL}/investments`;

const historicalDataUrl = (fromSymbol, toSymbol, timestamp, days) =>
  `https://min-api.cryptocompare.com/data/histoday?fsym=${fromSymbol}&tsym=${toSymbol}&limit=${days}&aggregate=1&toTs=${timestamp}`

const fetchPartialInvestments = fetch('GET', `${INVESTMENT_ENDPOINT}/partial`).run();
const fetchBTC = fetch('GET', historicalDataUrl('BTC', 'GBP', +(new Date), 30), {}, false);
const fetchETH = fetch('GET', historicalDataUrl('ETH', 'GBP', +(new Date), 30), {}, false);

const getBTC$ = () => fromPromise(fetchBTC.run().promise());
const getETH$ = () => fromPromise(fetchETH.run().promise());
const getPartialInvestment$ = () => fromPromise(fetchPartialInvestments.promise());

export const SET_PORTFOLIO_SUBSCRIPTION = 'STREAM::SET_PORTFOLIO_SUBSCRIPTION';
export const SET_LAST_30_DAYS_SUBSCRIPTION = 'STREAM::SET_LAST_30_DAYS_SUBSCRIPTION';

export const setPortfolioSubscription = createAction(SET_PORTFOLIO_SUBSCRIPTION);
export const setLast30DaysSubscription = createAction(SET_LAST_30_DAYS_SUBSCRIPTION);

export const startPortfolioStream = () => dispatch => {
  const btc$ = connect('BTC', 'Coinfloor');
  const eth$ = connect('ETH', 'Kraken');

  const observer = {
    next: compose(dispatch, setPortfolioValue),
    error: errorValue => console.log(`Error in the observer of the portfolio stream: ${errorValue}`)
  }

  const getPriceObj = data => ({
    price: data.PRICE,
    market: data.MARKET,
    symbol: data.FROMSYMBOL
  })

  const getPrices = (investments, btc, eth)  => {
    return {
      investments: fromJS(investments.result),
      prices: fromJS({
        BTX: getPriceObj(btc),
        ETH: getPriceObj(eth)
      })
    }
  }

  const subscription = combine(getPrices, getPartialInvestment$(), btc$, eth$)
    .chain(calculateTotalPortfolioValue)
    .subscribe(observer);

  dispatch(setPortfolioSubscription(subscription));
};

export const startLast30DaysStream = () => dispatch => {
  const partialInvestments$ = fromPromise(fetchPartialInvestments.promise());

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

// value for each investment individually
export const startInvestmentTotalValueStream = () => dispatch => {
    const subscription = combine(getPrices, getPartialInvestment$(), getBTC$(), getETH$())
      .chain(calculateHistoricPortfolioValues)
      .subscribe(observer);
}
