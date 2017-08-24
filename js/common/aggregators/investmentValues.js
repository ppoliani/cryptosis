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

const getCurrentPrice = (prices, investment) => prices.getIn([investment.get('investmentType'), 'price']);

const getInvestmentValues = (investments, prices) => investments.map(
  investment => ((getInvestmentValue) ['∘'] (partial(getCurrentPrice, prices)))(investment)(investment)
)

const calculateInvestmentValues = ({investments, prices}) => getInvestmentValues(investments, prices);

module.exports = {calculateInvestmentValues, getInvestmentValues};
