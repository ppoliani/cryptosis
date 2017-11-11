const test = require('ava')
const {fromJS} = require('immutable')
const {calculateHoldings} = require('./holdings')
const {calculatePortfolioValue} = require('./portfolioValue')

const fx = fromJS({
  BTC: {price: 5000},
  GBP: {price: 1},
  VTC: {price: 2}
});

test('calculatePortfolioValue should find the correct total value of the portfolio if there is a single transaction', t => {
  const txns = fromJS({
    1: {
      buyAsset: 'BTC',
      buyAmount: 5,
      sellAsset: 'GBP',
      sellAmount: 5000
    }
  });

  const holdings = calculateHoldings(txns);
  const totalValue = calculatePortfolioValue(holdings, fx);

  t.is(totalValue, 20000);
});


test('calculatePortfolioValue should find the correct total value of the portfolio if there more than one transactions', t => {
  const txns = fromJS({
    1: {
      buyAsset: 'BTC',
      buyAmount: 5,
      sellAsset: 'GBP',
      sellAmount: 5000
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
      sellAmount: 3
    }
  });

  const holdings = calculateHoldings(txns);
  const totalValue = calculatePortfolioValue(holdings, fx);

  t.is(totalValue, 20000);
});
