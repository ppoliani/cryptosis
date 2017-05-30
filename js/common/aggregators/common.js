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

const getValueForPrice = (price, qty) => qty * price;
const merger = (val1, val2) => val1 - val2;

// finds the total quantity (buys - sells)
const calculatePortfolioTotalQtyPerType = investments => {
  const totalQtyBoughPerType = calculateTotalQtyPerType(filterBuys(investments));
  const totalQtySoldPerType = calculateTotalQtyPerType(filterSells(investments));

  return totalQtyBoughPerType
    .mergeWith(merger, totalQtySoldPerType);
}

// Finds the total value per type of investment based on the current buy price
const calculateCurrentValuePerType = (investments, prices) =>
  calculatePortfolioTotalQtyPerType(investments)
    .map((qty, type) => getValueForPrice(qty, prices.getIn([type, 'price'])))

const calculateCurrentValueAtPrice = (investments, price) =>
  calculatePortfolioTotalQtyPerType(investments)
    .map(partial(getValueForPrice, price))

const getPercentageChange = (diff, initial) => (diff / initial) * 100

const getInvestmentValueChange = (qty, buyPrice, sellPrice) => qty * sellPrice - qty * buyPrice

// we need to find the total portfolio value on the given date.
// Investments that didn't exist on that date should not contribute to the figure
const getTotalValueAfterDate = (investments, investmentType, date, priceOfDay) => {
  const filteredIvestments = investments
    .filter(i => i.get('investmentType') === investmentType && isBefore(i.get('date'), date));

  return calculateCurrentLiquidValueForType(filteredIvestments, priceOfDay, investmentType)
}

const getPriceObjFromStreamData = data => ({
  price: data.PRICE,
  market: data.MARKET,
  symbol: data.FROMSYMBOL
})

// total cash from the positions sold
const calculateTotalCash = investments => calculateTotalPerType(filterSells(investments))

const calculateTotalAmountInvested = investments => calculateTotalPerType(filterBuys(investments))

// total invested per investment type - total cash per investment type
const calculateNetCost = investments =>
  // net cost includes expenses for both buy and sells
  calculateTotalAmountInvested(investments).mergeWith(
    merger,
    calculateTotalCash(investments)
  )

// finds the current liquid value for the given investment type (described byt)
const calculateCurrentLiquidValueForType = (investments, currentPrice, investmentType) => {
  const currentTotalValue = calculateCurrentValueAtPrice(investments, currentPrice).get(investmentType) || 0;
  const totalCash = calculateTotalCash(investments).get(investmentType) || 0;

  return currentTotalValue + totalCash;
}

const filterBuys = investments => investments.filter(v => v.get('positionType') === 'buy')
const filterSells = investments => investments.filter(v => v.get('positionType') === 'sell')

module.exports = {
  filterBuys,
  filterSells,
  calculateNetCost,
  calculateTotalCash,
  calculateTotalAmountInvested,
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
