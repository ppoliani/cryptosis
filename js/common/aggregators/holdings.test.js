const test = require('ava')
const {fromJS} = require('immutable')
const {calculateHoldings, calculateTransactionFees} = require('./holdings')

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
      feeAsset: 'GBP',
      feeAmount: 10
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
      feeAsset: 'GBP',
      feeAmount: 10
    },
    2: {
      buyAsset: 'VTC',
      buyAmount: 400,
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

  const result = calculateHoldings(txns).toJS();

  t.deepEqual(result, {BTC: 0.9, GBP: 9980, VTC: 400})
});
