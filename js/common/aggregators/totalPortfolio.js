const {fromJS} = require('immutable');
const {calculateHoldings} = require('./holdings')
const {calculatePortfolioValue} = require('./portfolioValue')

const calculateTotalPortfolioValue = ({transactions, fx}) => {
  const holdings = calculateHoldings(transactions);

  return fromJS({
    holdings,
    ...calculatePortfolioValue(holdings, fx)
  });
}


module.exports = {calculateTotalPortfolioValue};
