const {Map} = require('immutable');
const {getInvestmentValueChange} = require('../../../common/aggregators/common');

const calculatePortfolioState = (investments, qtySold, priceSold) => investments
  .reduce((acc, investment, investmentId) => {
      const qty = acc.get('quantity');

      if(qty > 0) {
        const diff = investment.get('quantity') - qty;
        const qtyUsed = diff < 0 ? investment.get('quantity') : qty;

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


const calculatePortfolioValueOnSellAdded = (investments, sell) => {

}

module.exports = {calculatePortfolioState, calculatePortfolioValueOnSellAdded};
