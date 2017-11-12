const test = require('ava')
const {fromJS} = require('immutable')
const {calculateHoldings, calculateExposure} = require('./holdings')

const fx = fromJS({
  BTC: {price: 5000},
  GBP: {price: 1},
  VTC: {price: 2},
  USD: {price: 2}
});

test('calculateHoldings should show the correct holdings when there is one transaction', t => {
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

  const result = calculateHoldings(txns).toJS();

  t.deepEqual(result, {BTC: 5, GBP: -5010})
});

test('calculateHoldings should show the correct holdings when there is more than one transactions', t => {
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
      buyAmount: 400,
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

  const result = calculateHoldings(txns).toJS();

  t.deepEqual(result, {BTC: 0.9, GBP: 9980, VTC: 400})
});

test('calculateExposure should return the sum of all sell fiat assets', t => {
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
      buyAmount: 10,
      sellAsset: 'USD',
      sellAmount: 15000,
      feesAsset: 'USD',
      feesAmount: 10
    }
  });

  const result = calculateExposure(txns).toJS();
  t.deepEqual(result, {GBP: 5010, USD: 15010})
});
