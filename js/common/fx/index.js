const changePriceToSelectedCurrency = (currency, fx, investment) => {
  const investmentCurrency = investment.get('currency');
  const price = investment.get('price');

  if(currency === investmentCurrency) return investment;
  return investment.set('price', convertCurrency(price, investmentCurrency, fx));
}

const convertCurrency = (value, to, fx) => value / fx.get(to);

const convertToBaseCurrency = (base, to, value, fx) => base === to
  ? value
  : convertCurrency(value, to, fx);

module.exports = {
  changePriceToSelectedCurrency,
  convertToBaseCurrency
}
