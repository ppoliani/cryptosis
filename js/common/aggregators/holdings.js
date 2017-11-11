const {Map} = require('immutable')
const {partial} = require('../core/fn')

const merger = (val1, val2) => val1 - val2;

const merge = (buys, sells) => {
  // make sure all keys are included in both dictionaries
  const keys = [...buys.keys(), ...sells.keys()];

  return keys.reduce(
    (acc, key) => acc.set(key, buys.get(key, 0) - sells.get(key, 0)),
    Map()
  )
}

// { [id]: Transaction } -> { [asset] -> qty }
const filterTxns = (positionType, transactions) => 
  transactions.reduce((acc, txn) => 
    acc.update(
      txn.get(`${positionType}Asset`),
      (sum=0) => sum + txn.get(`${positionType}Amount`)
    ), 
    Map()
  )


const filterBuys = partial(filterTxns, 'buy');
const filterSells = partial(filterTxns, 'sell');

// what is the amount of each assets that the portfolio currenlty holds
const calculateHoldings = transactions => merge(
  filterBuys(transactions), 
  filterSells(transactions)
);

module.exports = {
  calculateHoldings
}
