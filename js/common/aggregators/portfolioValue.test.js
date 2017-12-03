const test = require('ava')
const {fromJS} = require('immutable')
const {calculateHoldings, calculateExposure} = require('./holdings')
const {
  calculateHoldingsValue, 
  calculateCapitalGain, 
  calculateTransactionFees,
  calculatePortfolioExposure
} = require('./portfolioValue')

const fx = fromJS({
  BTC: {price: 5000},
  GBP: {price: 1},
  VTC: {price: 2},
  USD: {price: 2}
});

test('calculateHoldingsValue should find the correct total value of the portfolio if there is a single transaction', t => {
  const txns = fromJS({
    1: {
      buyAsset: 'BTC',
      buyAmount: 5,
      sellAsset: 'GBP',
      sellAmount: 5000,
      feesAsset: 'GBP',
      feesAmount: 10
    }
  });

  const holdings = calculateHoldings(txns);
  const portfolio = calculateHoldingsValue(holdings, fx);

  t.is(portfolio.assetValues.get('BTC'), 25000);
  t.is(portfolio.assetValues.get('GBP'), -5010);
  t.is(portfolio.totalValue, 19990);
});

test('calculateHoldingsValue should find the correct total value of the portfolio if there more than one transactions', t => {
  const txns = fromJS({
    1: {
      buyAsset: 'BTC',
      buyAmount: 5,
      sellAsset: 'GBP',
      sellAmount: 5000,
      feesAsset: 'GBP',
      feesAmount: 10
    },
    2: {
      buyAsset: 'VTC',
      buyAmount: 500,
      sellAsset: 'BTC',
      sellAmount: 1,
      feesAsset: 'BTC',
      feesAmount: 0.1
    },
    3: {
      buyAsset: 'GBP',
      buyAmount: 15000,
      sellAsset: 'BTC',
      sellAmount: 3,
      feesAsset: 'GBP',
      feesAmount: 10
    }
  });

  const holdings = calculateHoldings(txns);
  const portfolio = calculateHoldingsValue(holdings, fx);

  t.is(portfolio.assetValues.get('BTC'), 4500);
  t.is(portfolio.assetValues.get('GBP'), 9980);
  t.is(portfolio.assetValues.get('VTC'), 1000);
  t.is(portfolio.totalValue, 15480);
});

test('calculateCapitalGain should return the sum of holding in fiat currencies', t => {
  const txns = fromJS({
    1: {
      buyAsset: 'BTC',
      buyAmount: 5,
      sellAsset: 'GBP',
      sellAmount: 5000,
      feesAsset: 'GBP',
      feesAmount: 10
    },
    2: {
      buyAsset: 'VTC',
      buyAmount: 500,
      sellAsset: 'BTC',
      sellAmount: 1
    },
    3: {
      buyAsset: 'GBP',
      buyAmount: 15000,
      sellAsset: 'BTC',
      sellAmount: 2,
      feesAsset: 'GBP',
      feesAmount: 10
    },
    4: {
      buyAsset: 'USD',
      buyAmount: 20000,
      sellAsset: 'BTC',
      sellAmount: 1,
      feesAsset: 'USD',
      feesAmount: 10
    }
  });

  const holdings = calculateHoldings(txns);
  const capitalGain = calculateCapitalGain(holdings, fx);

  t.is(capitalGain.assetValues.get('GBP'), 9980);
  t.is(capitalGain.assetValues.get('USD'), 39980);
  t.is(capitalGain.totalValue, 49960);
});

test('calculatePortfolioExposure should return the sum of fiat currencies that were used to buy cryptos', t => {
  const txns = fromJS({
    1: {
      buyAsset: 'BTC',
      buyAmount: 5,
      sellAsset: 'GBP',
      sellAmount: 5000,
      feesAsset: 'GBP',
      feesAmount: 10
    },
    2: {
      buyAsset: 'BTC',
      buyAmount: 5,
      sellAsset: 'USD',
      sellAmount: 10000,
      feesAsset: 'USD',
      feesAmount: 10
    }
  });

  const exposureHoldings = calculateExposure(txns);
  const portfolioExposure = calculatePortfolioExposure(exposureHoldings, fx);

  t.is(portfolioExposure.assetExposure.get('GBP'), 5010);
  t.is(portfolioExposure.assetExposure.get('USD'), 20020);
  t.is(portfolioExposure.totalExposure, 25030);
});
