const test = require('ava')
const {fromJS} = require('immutable')
const {calculateHoldings} = require('./holdings')
const {calculatePortfolioValue, calculateCapitalGain, calculateTransactionFees} = require('./portfolioValue')

const fx = fromJS({
  BTC: {price: 5000},
  GBP: {price: 1},
  VTC: {price: 2},
  USD: {price: 2}
});

test('calculatePortfolioValue should find the correct total value of the portfolio if there is a single transaction', t => {
  const txns = fromJS({
    1: {
      buyAsset: 'BTC',
      buyAmount: 5,
      sellAsset: 'GBP',
      sellAmount: 5000,
      feeAsset: 'GBP',
      feeAmount: 10
    }
  });

  const holdings = calculateHoldings(txns);
  const portfolio = calculatePortfolioValue(holdings, fx);

  t.is(portfolio.assetValues.get('BTC'), 25000);
  t.is(portfolio.assetValues.get('GBP'), -5010);
  t.is(portfolio.totalValue, 19990);
});

test('calculatePortfolioValue should find the correct total value of the portfolio if there more than one transactions', t => {
  const txns = fromJS({
    1: {
      buyAsset: 'BTC',
      buyAmount: 5,
      sellAsset: 'GBP',
      sellAmount: 5000,
      feeAsset: 'GBP',
      feeAmount: 10
    },
    2: {
      buyAsset: 'VTC',
      buyAmount: 500,
      sellAsset: 'BTC',
      sellAmount: 1,
      feeAsset: 'BTC',
      feeAmount: 0.1
    },
    3: {
      buyAsset: 'GBP',
      buyAmount: 15000,
      sellAsset: 'BTC',
      sellAmount: 3,
      feeAsset: 'GBP',
      feeAmount: 10
    }
  });

  const holdings = calculateHoldings(txns);
  const portfolio = calculatePortfolioValue(holdings, fx);

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
      feeAsset: 'GBP',
      feeAmount: 10
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
      feeAsset: 'GBP',
      feeAmount: 10
    },
    4: {
      buyAsset: 'USD',
      buyAmount: 20000,
      sellAsset: 'BTC',
      sellAmount: 1,
      feeAsset: 'USD',
      feeAmount: 10
    }
  });

  const holdings = calculateHoldings(txns);
  const capitalGain = calculateCapitalGain(holdings, fx);

  t.is(capitalGain.assetValues.get('GBP'), 9980);
  t.is(capitalGain.assetValues.get('USD'), 39980);
  t.is(capitalGain.totalValue, 49960);
});
