const {fromJS} = require('immutable');
const {calculateHoldings, calculateExposure} = require('./holdings')
const {calculatePortfolioValue} = require('./portfolioValue')

const calculateTotalPortfolioValue = ({transactions, fx}) => {
  const holdings = calculateHoldings(transactions);
  const calculateExposure = calculateExposure(transactions, fx);

  return fromJS({
    holdings,
    exposure,
    ...calculatePortfolioValue(holdings, fx)
  });
}


module.exports = {calculateTotalPortfolioValue};
