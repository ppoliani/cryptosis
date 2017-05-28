const test = require('ava');
const {Map} = require('immutable');
const {calculatePortfolioState} = require('./portfolioService');

const getGain = (qty, buyPrice, sellPrice, expenses) => qty * sellPrice - qty * buyPrice

test.beforeEach(t => {
  t.context.investments = Map({
    '1': Map({quantity: 5, price: 1000, expenses: 0}),
    '2': Map({quantity: 5, price: 1500, expenses: 10}),
    '3': Map({quantity: 6, price: 2000, expenses: 0})
  });
})

test('calculatePortfolioState should return empty Map if 0 items were sold', t => {
  t.is(
    calculatePortfolioState(t.context.investments, 0, 1000).size,
    0
  )
})

test('calculatePortfolioState should reduce the amount of the first investment if the quantity is greater than the qty that was sold', t => {
  t.deepEqual(
    calculatePortfolioState(t.context.investments, 3, 1500).toJS(),
    {
      '1': {
        qtyUsed: 3,
        qtyLeft: 2,
        gain: getGain(3, 1000, 1500)
      }
    }
  )
})
