import fetch from '../../helpers/api';
import {fromPromise} from 'most';

const INVESTMENT_ENDPOINT = `${process.env.API_URL}/investments`;

const historicalDataUrl = (fromSymbol, toSymbol, timestamp, days) =>
  `https://min-api.cryptocompare.com/data/histoday?fsym=${fromSymbol}&tsym=${toSymbol}&limit=${days}&aggregate=1&toTs=${timestamp}`

const fetchPartialInvestments = fetch('GET', `${INVESTMENT_ENDPOINT}/partial`).run();
const fetchBTC = fetch('GET', historicalDataUrl('BTC', 'GBP', +(new Date), 30), {}, false);
const fetchETH = fetch('GET', historicalDataUrl('ETH', 'GBP', +(new Date), 30), {}, false);

export const getBTC$ = () => fromPromise(fetchBTC.run().promise());
export const getETH$ = () => fromPromise(fetchETH.run().promise());
export const getPartialInvestment$ = () => fromPromise(fetchPartialInvestments.promise());

export const getPriceObjFromStreamData = data => ({
  price: data.PRICE,
  market: data.MARKET,
  symbol: data.FROMSYMBOL
})

