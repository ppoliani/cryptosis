const {Map} = require('immutable');
const {getInvestmentValueChange} = require('../../../common/aggregators/common');

const calculatePortfolioState = (investments, qtySold, priceSold) => {
	return investments.reduce((acc, investment, investmentId) => {
    if(acc.get('quantity') > 0) {
      const diff = investment.get('quantity') - acc.get('quantity');
      const qtyUsed = diff < 0 ? investment.get('quantity') : qtySold;

      return acc
        .set('quantity', Math.abs(Math.min(diff, 0)))
        .setIn(['investments', investmentId], Map({
          qtyUsed,
          qtyLeft: Math.max(diff, 0),
          gain: getInvestmentValueChange(qtyUsed, investment.get('price'), priceSold)
        }))
    }

    return acc;
  }, Map({investments: Map(), quantity: qtySold}))
  .get('investments')
}


const calculatePortfolioValueOnSellAdded = (investments, sell) => {

}

module.exports = {calculatePortfolioState, calculatePortfolioValueOnSellAdded};
