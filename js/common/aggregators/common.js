const {Map} = require('immutable');
const isBefore = require('date-fns/is_before');
const {partial} = require('../core/fn');

// { [id]: Investment  } -> { [InvestmentType] -> Value }
const groupTotalValuePerTypeReducer = (acc, v) =>
  acc.update(
    v.get('investmentType'),
    0,
    sum => sum + getTotalForInvestment(v)
  )

const groupTotalQtyPerTypeReducer = (acc, v) =>
 acc.update(
    v.get('investmentType'),
    0,
    qty => qty + v.get('quantity')
  )

// Investment CurrentPrice -> Value
const getCurrentTotalForInvestment = (investment, currentPrice) => investment.get('quantity') * currentPrice

// when we sell and get cash we need to sutract the expenses
const includeExpenses = (i, value) => i.get('positionType') === 'buy'
    ? value + i.get('expenses')
    : value - i.get('expenses')

// Investment PriceOfPurchase -> Value
const getTotalForInvestment = i => includeExpenses(i, i.get('price') * i.get('quantity'));

// Finds the total money invested per type of investment
const calculateTotalPerType = investments => investments.reduce(groupTotalValuePerTypeReducer, Map())

// finds the total quanityt inlcuding only buys or sells
const calculateTotalQtyPerType = investments => investments.reduce(groupTotalQtyPerTypeReducer, Map())

const merger = (val1, val2) => val1 - val2;

// finds the total quanityt inlcuding buys and sels
const calculatePortfolioTotalQtyPerType = investments => {
  const totalQtyBoughPerType = calculateTotalQtyPerType(filterBuys(investments));
  const totalQtySoldPerType = calculateTotalQtyPerType(filterSells(investments));

  return totalQtyBoughPerType
    .mergeWith(merger, totalQtySoldPerType);
}

// Finds the total value per type of investment based on the current buy price
const calculateCurrentValuePerType = (investments, prices) =>
  calculatePortfolioTotalQtyPerType(investments)
    .map((qty, type) => qty * prices.getIn([type, 'price']))

const getPercentageChange = (diff, initial) => (diff / initial) * 100

const getInvestmentValueChange = (qty, buyPrice, sellPrice) => qty * sellPrice - qty * buyPrice

// we need to find the total portfolio value on the given date.
// Investments that didn't exist on that date should not contribute to the figure
const getTotalValueAfterDate = (investments, symbol, date, priceOfDay) =>
  investments
    .filter(i => i.get('investmentType') === symbol && isBefore(i.get('date'), date))
    .reduce(
      (sum, investment) => sum + getInvestmentValueChange(investment, priceOfDay),
      0
    )

const getPriceObjFromStreamData = data => ({
  price: data.PRICE,
  market: data.MARKET,
  symbol: data.FROMSYMBOL
})

// total cash from the positions sold
const calculateTotalCash = investments => calculateTotalPerType(filterSells(investments));

// total invested per investment type - total cash per investment type
const calculateNetCost = investments => {
  const totalInvested = calculateTotalPerType(filterBuys(investments));
  const totalCash = calculateTotalPerType(filterSells(investments));

  // net cost includes expenses for both buy and sells
  return totalInvested.mergeWith(
    merger,
    totalCash
  )
};

const filterBuys = investments => investments.filter(v => v.get('positionType') === 'buy')
const filterSells = investments => investments.filter(v => v.get('positionType') === 'sell')

module.exports = {
  filterBuys,
  filterSells,
  calculateNetCost,
  calculateTotalCash,
  calculatePortfolioTotalQtyPerType,
  getInvestmentValueChange,
  getCurrentTotalForInvestment,
  getTotalForInvestment,
  calculateTotalPerType,
  calculateCurrentValuePerType,
  getPercentageChange,
  getTotalValueAfterDate,
  getPriceObjFromStreamData
}
