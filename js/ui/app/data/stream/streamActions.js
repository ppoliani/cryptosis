import {createAction} from 'redux-actions';
import {combine} from 'most';
import compose from 'folktale/core/lambda/compose';
import {connect} from '../../services/sockets/cryptoCompare';
import {calculateTotalPortfolioValue} from '../../services/aggregators';
import {setPortfolioValue} from '../portfolio/portfolioActions';

export const SET_PORTFOLIO_SUBSCRIPTION= 'STREAM::SET_PORTFOLIO_SUBSCRIPTION';

export const startPortfolioStream = () => (dispatch, getState) => {
  const getInvestments = () => {
    const {investment} = getState();
    return investment.get('partialInvestments');
  };
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

  const getPrices = (btc, eth) => ([getPriceObj(btc), getPriceObj(eth)]);
  const subscription = combine(getPrices, btc$, eth$)
    .chain(prices => calculateTotalPortfolioValue({investments: getInvestments(), prices}))
    .subscribe(observer);

  dispatch(setPortfolioSubscription(subscription))
};

export const setPortfolioSubscription = createAction(SET_PORTFOLIO_SUBSCRIPTION);
