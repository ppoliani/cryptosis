import fetch from '../../helpers/api';
import {fromPromise} from 'most';

const INVESTMENT_ENDPOINT = `${process.env.API_URL}/investments`;

const historicalDataUrl = (fromSymbol, toSymbol, timestamp, days) =>
  `https://min-api.cryptocompare.com/data/histoday?fsym=${fromSymbol}&tsym=${toSymbol}&limit=${days}&aggregate=1&toTs=${timestamp}`

const fetchPartialInvestments = fetch('GET', `${INVESTMENT_ENDPOINT}/partial`);
const fetchBTC = currency => fetch('GET', historicalDataUrl('BTC', currency, +(new Date), 30), {}, false);
const fetchETH = currency => fetch('GET', historicalDataUrl('ETH', currency, +(new Date), 30), {}, false);

export const getBTC$ = currency => fromPromise(fetchBTC(currency).run().promise());
export const getETH$ = currency => fromPromise(fetchETH(currency).run().promise());
export const getPartialInvestment$ = () => fromPromise(fetchPartialInvestments.run().promise());

export const getPriceObjFromStreamData = data => ({
  price: data.PRICE,
  market: data.MARKET,
  symbol: data.FROMSYMBOL
})

