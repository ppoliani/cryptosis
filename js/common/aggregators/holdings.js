const {Map} = require('immutable')
const {partial} = require('../core/fn')

const merger = (val1, val2) => val1 - val2;

const merge = (buys, sells, fees) => {
  // make sure all keys are included in both dictionaries
  const keys = [...buys.keys(), ...sells.keys()];

  return keys.reduce(
    (acc, key) => acc.set(key, buys.get(key, 0) - sells.get(key, 0) - fees.get(key, 0)),
    Map()
  )
}

// { [id]: Transaction } -> { [asset] -> qty }
const groupTxns = (positionType, txns) => 
  txns.reduce((acc, txn) => 
    acc.update(
      txn.get(`${positionType}Asset`),
      (sum=0) => sum + txn.get(`${positionType}Amount`)
    ), 
    Map()
  )


const groupBuys = partial(groupTxns, 'buy');
const groupSells = partial(groupTxns, 'sell');

// what is the amount of each assets that the portfolio currenlty holds
const calculateHoldings = txns => merge(
  groupBuys(txns), 
  groupSells(txns),
  calculateTransactionFees(txns)
);

const calculateTransactionFees = txns => txns.reduce(
  (fees, txn) => 
    fees.update(
      txn.get('feeAsset'),
      (sum=0) => sum + txn.get('feeAmount')
    ),
    Map()
)

module.exports = {
  calculateHoldings
}
