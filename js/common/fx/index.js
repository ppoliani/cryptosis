const changePriceToSelectedCurrency = (currency, fx, investment) => {
  const investmentCurrency = investment.get('currency');
  const price = investment.get('price');

  if(currency === investmentCurrency) return investment;
  return investment.set('price', price * fx[investmentCurrency]);
}

module.exports = {
  changePriceToSelectedCurrency
}
