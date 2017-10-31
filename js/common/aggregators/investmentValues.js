const {fromJS, Map} = require('immutable');
const curry = require('folktale/core/lambda/curry');
const {partial} = require('../core/fn');
const {getTotalAmountInvested, getCurrentTotalForInvestment, getPercentageChange} = require('./common');


const getInvestmentValue = curry(2, (currentPrice, investment) => {
  const investmentValue = getTotalAmountInvested(investment);
  const diff = getCurrentTotalForInvestment(investment, currentPrice) - investmentValue;

  return Map({
    value: diff,
    percentage: getPercentageChange(diff, investmentValue)
  });
});

const getCurrentPrice = (prices, investment) => {
  return prices.getIn([investment.get('investmentType'), 'price']);
}

const getInvestmentValues = (investments, fx) => investments.map(
  investment => ((getInvestmentValue) ['∘'] (partial(getCurrentPrice, fx)))(investment)(investment)
)

const calculateInvestmentValues = ({investments, fx}) => getInvestmentValues(investments, fx);

module.exports = {calculateInvestmentValues, getInvestmentValues};
