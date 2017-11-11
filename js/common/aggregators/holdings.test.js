const test = require('ava')
const {fromJS} = require('immutable')
const {calculateHoldings} = require('./holdings')

test('calculateHoldings should show the correct holdings when there is one transaction', t => {
  const txns = fromJS({
    1: {
      buyAsset: 'BTC',
      buyAmount: 5,
      sellAsset: 'GBP',
      sellAmount: 5000
    }
  });

  const result = calculateHoldings(txns).toJS();

  t.deepEqual(result, {BTC: 5, GBP: -5000})
});

test('calculateHoldings should show the correct holdings when there is more than one transactions', t => {
  const txns = fromJS({
    1: {
      buyAsset: 'BTC',
      buyAmount: 5,
      sellAsset: 'GBP',
      sellAmount: 5000
    },
    2: {
      buyAsset: 'VTC',
      buyAmount: 400,
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

  const result = calculateHoldings(txns).toJS();

  t.deepEqual(result, {BTC: 1, GBP: 10000, VTC: 400})
});
