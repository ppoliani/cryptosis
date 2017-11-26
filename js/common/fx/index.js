const convertCurrency = (value, to, fx) => value / fx.get(to);

const convertToBaseCurrency = (base, to, value, fx) => base === to
  ? value
  : convertCurrency(value, to, fx);

module.exports = {convertToBaseCurrency}
