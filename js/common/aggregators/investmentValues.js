const {fromJS, Map} = require('immutable');
const {create} = require('@most/create');
const curry = require('folktale/core/lambda/curry');
const compose = require('folktale/core/lambda/compose');
const {partial} = require('../core/fn');
const {getTotalForInvestment, getCurrentTotalForInvestment, getPercentageChange} = require('./common');


const getInvestmentValue = curry(2, (currentPrice, investment) => {
  const investmentValue = getTotalForInvestment(investment);
  const diff = getCurrentTotalForInvestment(investment, currentPrice) - investmentValue;

  return Map({
    value: diff,
    percentage: getPercentageChange(diff, investmentValue)
  });
});

const getCurrentPrice = (prices, investment) => prices.getIn([investment.get('investmentType'), 'price']);

const getInvestmentValues = (investments, prices) => investments.map(
  investment => compose(getInvestmentValue, partial(getCurrentPrice, prices))(investment)(investment)
)

const calculateInvestmentValues = ({investments, prices}) =>
  create((add, end, error) => {
    add(getInvestmentValues(investments, prices));
    end();

    return () => console.log('Unsubscribe calculateInvestmentValues');
  });

module.exports = {calculateInvestmentValues, getInvestmentValues};
