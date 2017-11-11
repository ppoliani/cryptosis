const calculatePortfolioValue = (holdings, fx) => holdings.map((amount, asset) => amount * fx.getIn([asset, 'price']));

module.exports = {
  calculatePortfolioValue
}
